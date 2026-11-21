'use server';

import { db } from '@/db';
import { address } from '@/db/schemas/address-db-schema';
import {
    city,
    country,
    postalCode,
    state,
} from '@/db/schemas/location-db-schema';
import { property } from '@/db/schemas/property-db-schema';
import { propertyMember } from '@/db/schemas/property-member-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { auth } from '@/lib/auth/auth';
import { and, count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
    descriptionInput,
    descriptionSchema,
    ownershipAndLegalInput,
    ownershipAndLegalSchema,
    parkingAndSystemInput,
    parkingAndSystemSchema,
    sizeAndLayoutInput,
    sizeAndLayoutSchema,
    typeAndLocationSchema,
} from '../schemas/new-property-zod-schemas';
import { typeAndLocationUpdateType } from '../types';
import { textSlugify } from '@/lib/slugify';
import { propertyType } from '@/db/schemas/property-type-db-schema';
import { requireSession } from '@/lib/auth/require-session';
import { propertyStepProgress } from '@/db/schemas/property-step-progress-db-schema';

export const createPropertyDraft = async () => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');

        const [createdProperty] = await db
            .insert(property)
            .values({
                releaseStatus: 'draft',
            })
            .returning();

        if (!createdProperty) {
            throw new AppError(
                'INTERNAL_ERROR',
                'Failed to add you to this property',
            );
        }

        return ok(createdProperty);
    } catch (error) {
        return handleError(error);
    }
};

export const getProperty = async (id: string) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');

        const [foundProperty] = await db
            .select({
                property,
                address,
                city,
                state,
                country,
                postalCode,
                propertyType,
            })
            .from(property)
            .innerJoin(
                propertyMember,
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                ),
            )
            .leftJoin(address, eq(address.id, property.addressId))
            .leftJoin(city, eq(city.id, address.cityId))
            .leftJoin(state, eq(state.id, city.stateId))
            .leftJoin(country, eq(country.id, state.countryId))
            .leftJoin(postalCode, eq(postalCode.id, address.postalCodeId))
            .leftJoin(
                propertyType,
                eq(propertyType.id, property.propertyTypeId),
            )
            .where(eq(property.id, id))
            .limit(1);

        if (!foundProperty) {
            throw new AppError('NOT_FOUND', 'Property not found');
        }

        return ok(foundProperty);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyLocation = async ({
    body,
    id,
}: typeAndLocationUpdateType) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');
        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const {
            city: cityName,
            country: countryName,
            state: stateName,
            property_type,
            street_address_1,
            street_address_2,
            zip_code,
            parcel_number,
            country_code,
            latitude,
            longitude,
            state_code,
        } = typeAndLocationSchema.parse(body);

        if (!country_code || !state_code || !latitude || !longitude) {
            throw new AppError(
                'BAD_REQUEST',
                " 'Please select your address from the suggestions so we can locate it on the map.',",
            );
        }

        const update = await db.transaction(async (tx) => {
            const [foundCountry] = await tx
                .select({ id: country.id })
                .from(country)
                .where(eq(country.name, countryName))
                .limit(1);

            const countryId =
                foundCountry?.id ??
                (
                    await tx
                        .insert(country)
                        .values({
                            name: countryName,
                            isoCode: country_code,
                            slug: textSlugify(countryName),
                        })
                        .returning({
                            id: country.id,
                        })
                )[0].id;

            const [foundState] = await tx
                .select({ id: state.id })
                .from(state)
                .where(
                    and(
                        eq(state.name, stateName),
                        eq(state.countryId, countryId),
                    ),
                )
                .limit(1);

            const stateId =
                foundState?.id ??
                (
                    await tx
                        .insert(state)
                        .values({
                            name: stateName,
                            code: state_code,
                            countryId,
                            slug: textSlugify(stateName),
                        })
                        .returning({
                            id: country.id,
                        })
                )[0].id;

            const [foundCity] = await tx
                .select({ id: city.id })
                .from(city)
                .where(and(eq(city.stateId, stateId), eq(city.name, cityName)))
                .limit(1);

            const cityId =
                foundCity?.id ??
                (
                    await tx
                        .insert(city)
                        .values({
                            name: cityName,
                            slug: textSlugify(cityName),
                            stateId,
                        })
                        .returning({
                            id: city.id,
                        })
                )[0].id;

            const [foundPostalCode] = await tx
                .select({ id: postalCode.id })
                .from(postalCode)
                .where(
                    and(
                        eq(postalCode.cityId, cityId),
                        eq(postalCode.code, zip_code),
                    ),
                )
                .limit(1);

            const postalCodeId =
                foundPostalCode?.id ??
                (
                    await tx
                        .insert(postalCode)
                        .values({
                            code: zip_code,
                            cityId,
                        })
                        .returning()
                )[0].id;

            const [current] = await tx
                .select({ addressId: property.addressId })
                .from(property)
                .where(eq(property.id, id))
                .limit(1);

            const addressValues = {
                streetLine1: street_address_1,
                streetLine2: street_address_2 || null,
                cityId,
                postalCodeId,
                longitude,
                latitude,
            };

            let addressId = current?.addressId;
            if (addressId) {
                await tx
                    .update(address)
                    .set(addressValues)
                    .where(eq(address.id, addressId));
            } else {
                const [createdAddress] = await tx
                    .insert(address)
                    .values(addressValues)
                    .returning({ id: address.id });
                addressId = createdAddress.id;
            }

            const [updatedProperty] = await tx
                .update(property)
                .set({
                    propertyTypeId: property_type,
                    addressId,
                    unitNumber: street_address_2 || null,
                    parcelNumber: parcel_number || null,
                    updatedAt: new Date(),
                })
                .where(eq(property.id, id))
                .returning();

            return updatedProperty;
        });

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyLayout = async ({
    body,
    id,
}: {
    id: string;
    body: sizeAndLayoutInput;
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const {
            bathrooms,
            bedrooms,
            build_year,
            living_area,
            floors,
            lot_size,
        } = sizeAndLayoutSchema.parse(body);

        const [update] = await db
            .update(property)
            .set({
                bathrooms: String(bathrooms),
                bedrooms,
                floors,
                yearBuilt: build_year,
                livingAreaSqft: living_area,
                lotSizeSqft: lot_size,
            })
            .where(eq(property.id, id))
            .returning();

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyParking = async ({
    body,
    id,
}: {
    id: string;
    body: parkingAndSystemInput;
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const { cooling_type, garage_spaces, heating_type, parking_spaces } =
            parkingAndSystemSchema.parse(body);

        const [update] = await db
            .update(property)
            .set({
                coolingType: cooling_type,
                heatingType: heating_type,
                garageSpaces: garage_spaces,
                parkingSpaces: parking_spaces,
            })
            .where(eq(property.id, id))
            .returning();

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyLegals = async ({
    body,
    id,
}: {
    id: string;
    body: ownershipAndLegalInput;
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const { hoa_name, owner_name, zoning } =
            ownershipAndLegalSchema.parse(body);

        const [update] = await db
            .update(property)
            .set({
                hoaName: hoa_name,
                ownerName: owner_name,
                zoning: zoning,
            })
            .where(eq(property.id, id))
            .returning();

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyDescription = async ({
    body,
    id,
}: {
    id: string;
    body: descriptionInput;
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const { description } = descriptionSchema.parse(body);

        const [update] = await db
            .update(property)
            .set({
                description,
            })
            .where(eq(property.id, id))
            .returning();

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const updatePropertyReleaseStatus = async ({
    body,
    id,
}: {
    id: string;
    body: { releaseStatus: 'draft' | 'hidden' | 'publish' };
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToUpdate] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToUpdate) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to edit this property',
            );
        }

        const { releaseStatus } = body;

        const [update] = await db
            .update(property)
            .set({
                releaseStatus,
            })
            .where(eq(property.id, id))
            .returning();

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteProperty = async (id: string) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const session = await requireSession();

        const [ableToDelete] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.propertyId, id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        if (!ableToDelete) {
            throw new AppError(
                'FORBIDDEN',
                'You do not have permission to delete this property',
            );
        }

        const deleted = await db
            .delete(property)
            .where(eq(property.id, id))
            .returning({ id: property.id });

        return ok(deleted);
    } catch (error) {
        return handleError(error);
    }
};

export const getPropertyCount = async () => {
    try {
        const session = await requireSession();

        const [row] = await db
            .select({ value: count() })
            .from(propertyMember)
            .innerJoin(property, eq(property.id, propertyMember.propertyId))
            .where(
                and(
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .limit(1);

        return ok(row.value);
    } catch (error) {
        return handleError(error);
    }
};

export const getPropertiesByUser = async () => {
    try {
        const session = await requireSession();

        const properties = await db
            .select({
                id: property.id,
                property_type: propertyType.name,
                status: property.releaseStatus,

                bedrooms: property.bedrooms,

                bathrooms: property.bathrooms,
                garage: property.garageSpaces,
                area_size: property.livingAreaSqft,
                created_at: property.createdAt,
                build_year: property.yearBuilt,
                stepId: propertyStepProgress.stepId,
            })
            .from(property)
            .innerJoin(
                propertyMember,
                and(
                    eq(propertyMember.propertyId, property.id),
                    eq(propertyMember.userId, session.user.id),
                    eq(propertyMember.role, 'owner'),
                ),
            )
            .leftJoin(
                propertyType,
                eq(propertyType.id, property.propertyTypeId),
            )
            .leftJoin(
                propertyStepProgress,
                eq(propertyStepProgress.propertyId, property.id),
            );

        return ok(properties);
    } catch (error) {
        return handleError(error);
    }
};
