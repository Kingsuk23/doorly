import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    numeric,
    check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { listing } from './listing';
import { agent } from './agent';

export const priceHistory = pgTable(
    'listing_price_history',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        listingId: uuid('listing_id')
            .references(() => listing.id, { onDelete: 'cascade' })
            .notNull(),
        changedBy: uuid('changed_by').references(() => agent.id, {
            onDelete: 'set null',
        }),

        oldPrice: numeric('old_price', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }),
        newPrice: numeric('new_price', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }).notNull(),
        changeReason: text('change_reason'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index('listing_price_history_listing_idx').on(t.listingId, t.createdAt),
        index('listing_price_history_changed_by_idx').on(t.changedBy),
        check('listing_price_history_new_chk', sql`${t.newPrice} > 0`),
        check(
            'listing_price_history_old_chk',
            sql`${t.oldPrice} IS NULL OR ${t.oldPrice} > 0`,
        ),
        check(
            'listing_price_history_diff_chk',
            sql`${t.oldPrice} IS NULL OR ${t.oldPrice} <> ${t.newPrice}`,
        ),
    ],
);
