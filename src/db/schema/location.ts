import {
    doublePrecision,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

export const country = pgTable('country', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    isoCode: text('iso_code').notNull().unique(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const state = pgTable(
    'state',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        countryId: uuid('country_id')
            .references(() => country.id)
            .notNull(),

        name: text('name').notNull(),
        slug: text('slug').notNull(),
        code: text('code'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex('state_country_slug_unique').on(
            table.countryId,
            table.slug,
        ),
    ],
);

export const city = pgTable(
    'city',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        stateId: uuid('state_id')
            .references(() => state.id)
            .notNull(),

        name: text('name').notNull(),
        slug: text('slug').notNull(),
        latitude: doublePrecision('latitude'),
        longitude: doublePrecision('longitude'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex('city_state_slug_unique').on(table.stateId, table.slug),
    ],
);

export const postalCode = pgTable(
    'postalCode',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        cityId: uuid('city_id')
            .references(() => city.id)
            .notNull(),
        code: text('code').notNull(),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex('postal_code_city_code_unique').on(
            table.cityId,
            table.code,
        ),
    ],
);
