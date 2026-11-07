import {
    check,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { listing } from './listing';
import { sql } from 'drizzle-orm';

export const virtualTour = pgTable(
    'virtual_tour',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        listingId: uuid('listing_id')
            .references(() => listing.id, { onDelete: 'cascade' })
            .notNull(),
        url: text('url').notNull(),
        provider: text('provider'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index('virtual_tours_listing_idx').on(t.listingId),
        uniqueIndex('virtual_tours_listing_url_uidx').on(t.listingId, t.url),
        check('virtual_tours_url_chk', sql`${t.url} ~* '^https://'`),
    ],
);
