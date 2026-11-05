import { db } from '@/db';
import { city, country, postalCode, state } from '@/db/schema/location';
import { textSlugify } from '@/lib/slugify';
import { and, eq } from 'drizzle-orm';

export const findOrCreateCountry = async ({
    isoCode,
    name,
}: {
    isoCode: string;
    name: string;
}): Promise<string> => {
    const [isExist] = await db
        .select({ id: country.id })
        .from(country)
        .where(eq(country.isoCode, isoCode))
        .limit(1);

    if (isExist) return isExist.id;

    const [created] = await db
        .insert(country)
        .values({
            isoCode,
            name,
            slug: textSlugify(name),
        })
        .onConflictDoNothing()
        .returning({ id: country.id });

    if (created) return created.id;

    const [again] = await db
        .select({ id: country.id })
        .from(country)
        .where(eq(country.isoCode, isoCode))
        .limit(1);
    if (!again) throw new Error('Could not resolve country');
    return again.id;
};

export const findOrCreateState = async ({
    isoCode,
    name,
    countryId,
}: {
    countryId: string;
    isoCode: string;
    name: string;
}): Promise<string> => {
    const [isExist] = await db
        .select({ id: state.id })
        .from(state)
        .where(eq(state.code, isoCode))
        .limit(1);

    if (isExist) return isExist.id;

    const [created] = await db
        .insert(state)
        .values({
            countryId,
            code: isoCode,
            name,
            slug: textSlugify(name),
        })
        .onConflictDoNothing()
        .returning({ id: state.id });

    if (created) return created.id;

    const [again] = await db
        .select({ id: state.id })
        .from(state)
        .where(eq(state.code, isoCode))
        .limit(1);

    if (!again) throw new Error('Could not resolve state');
    return again.id;
};

export const findOrCreateCity = async ({
    name,
    stateId,
}: {
    stateId: string;
    name: string;
}): Promise<string> => {
    const slug = textSlugify(name);
    const [isExist] = await db
        .select({ id: city.id })
        .from(city)
        .where(and(eq(city.stateId, stateId), eq(city.slug, slug)))
        .limit(1);

    if (isExist) return isExist.id;

    const [created] = await db
        .insert(city)
        .values({
            stateId,
            name,
            slug: textSlugify(name),
        })
        .onConflictDoNothing()
        .returning({ id: city.id });

    if (created) return created.id;

    const [again] = await db
        .select({ id: city.id })
        .from(city)
        .where(eq(city.name, name))
        .limit(1);

    if (!again) throw new Error('Could not resolve city');
    return again.id;
};

export const findOrCreatePostcode = async ({
    cityId,
    code,
}: {
    cityId: string;
    code: string;
}): Promise<string> => {
    const [isExist] = await db
        .select({ id: postalCode.id })
        .from(postalCode)
        .where(and(eq(postalCode.cityId, cityId), eq(postalCode.code, code)))
        .limit(1);

    if (isExist) return isExist.id;

    const [created] = await db
        .insert(postalCode)
        .values({
            cityId,
            code,
        })
        .onConflictDoNothing()
        .returning({ id: postalCode.id });

    if (created) return created.id;

    const [again] = await db
        .select({ id: postalCode.id })
        .from(postalCode)
        .where(and(eq(postalCode.cityId, cityId), eq(postalCode.code, code)))
        .limit(1);

    if (!again) throw new Error('Could not resolve post code');
    return again.id;
};
