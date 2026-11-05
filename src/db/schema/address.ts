import {
    doublePrecision,
    index,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { city, postalCode } from './location';

export const address = pgTable(
    'address',
    {
        id: uuid('id').primaryKey().defaultRandom(),

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
        index('address_street_idx').on(table.streetLine1),
        index('address_city_idx').on(table.cityId),
    ],
);
