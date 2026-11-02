import {
    boolean,
    doublePrecision,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { agent } from './agent';
import { city, postalCode } from './address';

export const agency = pgTable(
    'agency',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        name: text('name').notNull(),
        slug: text('slug').notNull(),
        license: text('license').notNull(),
        description: text('description'),

        email: text('email').notNull(),
        phone: text('phone').notNull(),
        website: text('website').notNull(),
        logoUrl: text('logo_url').notNull(),

        isVerified: boolean('is_verified').notNull().default(false),
        verifiedBy: uuid('verified_by').references(() => user.id),
        verifiedAt: timestamp('verified_at', { withTimezone: true }),

        streetLine1: text('street_line1').notNull(),
        streetLine2: text('street_line2'),
        cityId: uuid('city_id')
            .references(() => city.id)
            .notNull(),
        postalCodeId: uuid('postal_code_id').references(() => postalCode.id),
        latitude: doublePrecision('latitude'),
        longitude: doublePrecision('longitude'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        uniqueIndex('agencies_slug_unique').on(table.slug),
        uniqueIndex('agencies_license_unique').on(table.license),
        index('agencies_city_idx').on(table.cityId),
    ],
);
