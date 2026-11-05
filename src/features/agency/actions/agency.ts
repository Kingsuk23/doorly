'use server';

import { AgencyFormValues } from '../schema/agencySchema';
import { db } from '@/db';
import { address, country, state } from '@/db/schema/address';
import { agency } from '@/db/schema/agency';
import {
    findOrCreateCity,
    findOrCreateCountry,
    findOrCreatePostcode,
    findOrCreateState,
} from '@/features/address/action/address';
import { textSlugify } from '@/lib/slugify';

export const addAgency = async (inputs: AgencyFormValues) => {
    const {
        city,
        email,
        license,
        name,
        phone,
        postalCode,
        streetLine1,
        description,
        logoUrl,
        streetLine2,
        website,
        lat,
        lon,
    } = inputs;

    const latitude = lat !== undefined ? Number(lat) : null;
    const longitude = lon !== undefined ? Number(lon) : null;

    if (
        (latitude !== null && !Number.isFinite(latitude)) ||
        (longitude !== null && !Number.isFinite(longitude))
    ) {
        throw new Error('Invalid coordinates');
    }

    const res = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/address/reverse?lat=${lat}&lon=${lon}`,
    );

    const { data } = await res.json();

    const countryId = await findOrCreateCountry({
        isoCode: data.country_code as string,
        name: data.country as string,
    });

    const stateId = await findOrCreateState({
        countryId,
        isoCode: data.state_code as string,
        name: data.state as string,
    });

    const cityId = await findOrCreateCity({
        stateId,
        name: city,
    });

    const postalCodeId = await findOrCreatePostcode({
        cityId,
        code: postalCode,
    });

    const [createdAddress] = await db
        .insert(address)
        .values({
            cityId,
            streetLine1,
            streetLine2,
            postalCodeId,
            latitude,
            longitude,
        })
        .returning({ id: address.id });

    const [agencyId] = await db
        .insert(agency)
        .values({
            addressId: createdAddress.id,
            email,
            license,
            logoUrl,
            name,
            phone,
            website,
            description,
            slug: textSlugify(name),
        })
        .returning({ id: agency.id });

    return agencyId.id;
};
