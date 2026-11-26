import {
    check,
    index,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { property } from './property-db-schema';
import { agent } from './agent-db-schema';

export const listingTypeEnum = pgEnum('listing_type', ['rent', 'sale']);
export const listingStatus = pgEnum('listing_status', [
    'draft',
    'active',
    'pending',
    'sold',
    'rented',
    'withdrawn',
    'expired',
]);

export const listing = pgTable(
    'listing',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        propertyId: uuid('property_id')
            .references(() => property.id, { onDelete: 'cascade' })
            .notNull(),
        agentId: uuid('agent_id')
            .references(() => agent.id, { onDelete: 'cascade' })
            .notNull(),

        listing_type: listingTypeEnum('listing_type').default('sale').notNull(),
        status: listingStatus('status').default('draft').notNull(),

        price: numeric('price', { precision: 12, scale: 2 }),
        currency: text('currency').default('USD'),
        price_per_sqft: numeric('price_per_sqft', { precision: 12, scale: 2 }),

        listed_at: timestamp('listed_at', { withTimezone: true }),
        expires_at: timestamp('expires_at', { withTimezone: true }),
        sold_at: timestamp('sold_at', { withTimezone: true }),
        sold_price: numeric('sold_price', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }),

        title: text('title'),
        description: text('description'),
        mls_number: text('mls_number').unique(),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index('listing_property_idx').on(t.propertyId),
        index('listing_agent_idx').on(t.agentId),
        index('listings_search_idx').on(t.status, t.listing_type, t.price),
        index('listings_listed_at_idx').on(t.listed_at),
        uniqueIndex('listings_one_active_per_type_uidx')
            .on(t.propertyId, t.listing_type)
            .where(sql`${t.status} = 'active'`),
        check('listings_price_chk', sql`${t.price} > 0`),
        check(
            'listings_sold_chk',
            sql`${t.status} <> 'sold' OR (${t.sold_at} IS NOT NULL AND ${t.sold_price} IS NOT NULL)`,
        ),
        check(
            'listings_dates_chk',
            sql`${t.expires_at} IS NULL OR ${t.listed_at} IS NULL OR ${t.expires_at} > ${t.listed_at}`,
        ),
    ],
);

export type listingType = typeof listing.$inferSelect;
