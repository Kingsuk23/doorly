import {
    boolean,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { user } from './user-db-schema';
import { address } from './address-db-schema';

export const broker = pgTable(
    'broker',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        name: text('name').notNull(),
        slug: text('slug').notNull(),
        license: text('license').notNull().unique(),
        description: text('description'),

        email: text('email').notNull(),
        phone: text('phone').notNull(),
        website: text('website').notNull(),
        logo_url: text('logo_url').notNull(),
        logo_id: text('logo_id').notNull(),

        isVerified: boolean('is_verified').notNull().default(false),
        verifiedBy: uuid('verified_by').references(() => user.id, {
            onDelete: 'set null',
        }),
        verifiedAt: timestamp('verified_at', { withTimezone: true }),

        addressId: uuid('address')
            .references(() => address.id, { onDelete: 'cascade' })
            .notNull(),

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
    ],
);
