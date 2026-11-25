import { faker } from '@faker-js/faker';
import { and, eq } from 'drizzle-orm';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { db } from '..';
import {
    city,
    country,
    postalCode,
    state,
} from '../schemas/location-db-schema';
import { address } from '../schemas/address-db-schema';
import { broker } from '../schemas/broker-db-schema'; // adjust path
import { user } from '../schemas/user-db-schema';
import { textSlugify } from '@/lib/slugify';

type SeedAddress = {
    country_name: string;
    country_code: string;
    state_name: string;
    state_code: string;
    city_name: string;
    zip_code: string;
    street_address_1: string;
    street_address_2?: string | null;
    latitude: number;
    longitude: number;
};

const TOTAL = 100;

export const seedBroker = async () => {
    const file = path.join(process.cwd(), 'seed-data', 'addresses.json');
    const rows: SeedAddress[] = JSON.parse(await readFile(file, 'utf-8'));

    if (rows.length < TOTAL) {
        throw new Error(
            `addresses.json has ${rows.length} rows, need ${TOTAL}`,
        );
    }

    // optional: an existing user to act as the verifier
    const admins = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.role, 'admin'))
        .limit(3);

    if (admins.length === 0) {
        throw new Error('No admin users found. Run seed-users first.');
    }

    const cache = new Map<string, string>();
    const getOrCreate = async (
        key: string,
        find: () => Promise<string | undefined>,
        create: () => Promise<string>,
    ) => {
        const hit = cache.get(key);
        if (hit) return hit;
        const id = (await find()) ?? (await create());
        cache.set(key, id);
        return id;
    };

    for (let i = 0; i < TOTAL; i++) {
        const row = rows[i];

        await db.transaction(async (tx) => {
            const countryId = await getOrCreate(
                `c:${row.country_code}`,
                async () =>
                    (
                        await tx
                            .select({ id: country.id })
                            .from(country)
                            .where(eq(country.name, row.country_name))
                            .limit(1)
                    )[0]?.id,
                async () =>
                    (
                        await tx
                            .insert(country)
                            .values({
                                name: row.country_name,
                                isoCode: row.country_code,
                                slug: textSlugify(row.country_name),
                            })
                            .returning({ id: country.id })
                    )[0].id,
            );

            const stateId = await getOrCreate(
                `s:${countryId}:${row.state_name}`,
                async () =>
                    (
                        await tx
                            .select({ id: state.id })
                            .from(state)
                            .where(
                                and(
                                    eq(state.name, row.state_name),
                                    eq(state.countryId, countryId),
                                ),
                            )
                            .limit(1)
                    )[0]?.id,
                async () =>
                    (
                        await tx
                            .insert(state)
                            .values({
                                name: row.state_name,
                                code: row.state_code,
                                countryId,
                                slug: textSlugify(row.state_name),
                            })
                            .returning({ id: state.id })
                    )[0].id,
            );

            const cityId = await getOrCreate(
                `ci:${stateId}:${row.city_name}`,
                async () =>
                    (
                        await tx
                            .select({ id: city.id })
                            .from(city)
                            .where(
                                and(
                                    eq(city.stateId, stateId),
                                    eq(city.name, row.city_name),
                                ),
                            )
                            .limit(1)
                    )[0]?.id,
                async () =>
                    (
                        await tx
                            .insert(city)
                            .values({
                                name: row.city_name,
                                slug: textSlugify(row.city_name),
                                stateId,
                            })
                            .returning({ id: city.id })
                    )[0].id,
            );

            const postalCodeId = await getOrCreate(
                `p:${cityId}:${row.zip_code}`,
                async () =>
                    (
                        await tx
                            .select({ id: postalCode.id })
                            .from(postalCode)
                            .where(
                                and(
                                    eq(postalCode.cityId, cityId),
                                    eq(postalCode.code, row.zip_code),
                                ),
                            )
                            .limit(1)
                    )[0]?.id,
                async () =>
                    (
                        await tx
                            .insert(postalCode)
                            .values({ code: row.zip_code, cityId })
                            .returning({ id: postalCode.id })
                    )[0].id,
            );

            const [createdAddress] = await tx
                .insert(address)
                .values({
                    streetLine1: row.street_address_1,
                    streetLine2: row.street_address_2 || null,
                    cityId,
                    postalCodeId,
                    latitude: row.latitude, // String(...) if numeric/decimal column
                    longitude: row.longitude,
                })
                .returning({ id: address.id });

            // BROKER
            const name = faker.company.name();
            const isVerified = faker.datatype.boolean();

            await tx.insert(broker).values({
                name,
                slug: `${textSlugify(name)}-${faker.string.alphanumeric(5).toLowerCase()}`,
                license: `LIC-${faker.string.alphanumeric(8).toUpperCase()}`,
                description:
                    faker.company.catchPhrase() +
                    '. ' +
                    faker.lorem.sentences(2),
                email: faker.internet
                    .email({ provider: 'example.com' })
                    .toLowerCase(),
                phone: faker.phone.number(),
                website: faker.internet.url(),
                logo_url: faker.image.urlPicsumPhotos({
                    width: 200,
                    height: 200,
                }),
                logo_id: faker.string.uuid(),
                isVerified,
                verifiedBy: isVerified
                    ? faker.helpers.arrayElement(admins).id
                    : null,
                verifiedAt: isVerified ? faker.date.recent({ days: 90 }) : null,
                addressId: createdAddress.id,
            });
        });
    }

    console.log(`Seeded ${TOTAL} brokers with real addresses`);
};

seedBroker()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    });
