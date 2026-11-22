'use server';

import { requireSession } from '@/lib/auth/require-session';
import { brokerFormValues } from '../types';
import { AppError, ok } from '@/lib/api/result';
import { db } from '@/db';
import {
    city,
    country,
    postalCode,
    state,
} from '@/db/schemas/location-db-schema';
import { and, eq } from 'drizzle-orm';
import { textSlugify } from '@/lib/slugify';
import { broker } from '@/db/schemas/broker-db-schema';
import { address } from '@/db/schemas/address-db-schema';
import { handleError } from '@/lib/api/response';

export const ListABroker = async (body: brokerFormValues) => {
    try {
        await requireSession();

        const {
            avatar,
            city: cityName,
            country: countryName,
            email,
            license,
            name,
            phone,
            state: stateName,
            street_address_1,
            website,
            zip_code,
            country_code,
            description,
            latitude,
            longitude,
            state_code,
            street_address_2,
        } = body;

        if (!country_code || !state_code || !latitude || !longitude) {
            throw new AppError(
                'BAD_REQUEST',
                " 'Please select your address from the suggestions so we can locate it on the map.',",
            );
        }

        const create = await db.transaction(async (tx) => {
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

            const addressValues = {
                streetLine1: street_address_1,
                streetLine2: street_address_2 || null,
                cityId,
                postalCodeId,
                longitude,
                latitude,
            };

            const [createdAddress] = await tx
                .insert(address)
                .values(addressValues)
                .returning({ id: address.id });

            const addressId = createdAddress.id;

            const [createdBroker] = await tx
                .insert(broker)
                .values({
                    addressId,
                    email,
                    license,
                    logo_id: avatar.fileId,
                    logo_url: avatar.url,
                    name,
                    phone,
                    slug: textSlugify(name),
                    website,
                    description,
                })
                .returning({ id: broker.id });

            return createdBroker;
        });

        return ok(create);
    } catch (error) {
        return handleError(error);
    }
};

export const GetListedBrokers = async () => {
    try {
        const listedBroker = await db
            .select({ id: broker.id, name: broker.name })
            .from(broker);

        return ok(listedBroker);
    } catch (error) {
        return handleError(error);
    }
};
