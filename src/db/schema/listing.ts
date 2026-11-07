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
import { property } from './property';
import { agent } from './agent';
import { sql } from 'drizzle-orm';

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

        listingType: listingTypeEnum('listing_type').default('sale').notNull(),
        status: listingStatus('status').default('draft').notNull(),

        price: numeric('price', { precision: 12, scale: 2 }).notNull(),
        currency: text('currency').notNull().default('USD'),
        pricePerSqft: numeric('price_per_sqft', { precision: 12, scale: 2 }),

        listedAt: timestamp('listed_at', { withTimezone: true }),
        expiresAt: timestamp('expires_at', { withTimezone: true }),
        soldAt: timestamp('sold_at', { withTimezone: true }),
        soldPrice: numeric('sold_price', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }),

        title: text('title').notNull(),
        description: text('description'),
        mlsNumber: text('mls_number').unique(),

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
        index('listings_search_idx').on(t.status, t.listingType, t.price),
        index('listings_listed_at_idx').on(t.listedAt),
        uniqueIndex('listings_one_active_per_type_uidx')
            .on(t.propertyId, t.listingType)
            .where(sql`${t.status} = 'active'`),
        check('listings_price_chk', sql`${t.price} > 0`),
        check(
            'listings_sold_chk',
            sql`${t.status} <> 'sold' OR (${t.soldAt} IS NOT NULL AND ${t.soldPrice} IS NOT NULL)`,
        ),
        check(
            'listings_dates_chk',
            sql`${t.expiresAt} IS NULL OR ${t.listedAt} IS NULL OR ${t.expiresAt} > ${t.listedAt}`,
        ),
    ],
);
