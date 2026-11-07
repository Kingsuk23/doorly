import { check, index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { listing } from './listing';
import { sql } from 'drizzle-orm';

export const featuredListing = pgTable(
    'featured_listing',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        listingId: uuid('listing_id')
            .references(() => listing.id, { onDelete: 'cascade' })
            .notNull(),
        startDate: timestamp('start_date', { withTimezone: true }).notNull(),
        endDate: timestamp('end_date', { withTimezone: true }).notNull(),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index('featured_listings_listing_idx').on(t.listingId),
        index('featured_listing_dates_idx').on(t.startDate, t.endDate),
        check(
            'featured_listing_dates_check',
            sql`${t.endDate} > ${t.startDate}`,
        ),
    ],
);
