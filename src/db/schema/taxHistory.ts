import {
    check,
    integer,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { property } from './property';

export const taxPaidStatusEnum = pgEnum('tax_paid_status', [
    'paid',
    'unpaid',
    'partial',
    'delinquent',
    'unknown',
]);

export const taxHistory = pgTable(
    'tax_history',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        propertyId: uuid('property_id')
            .references(() => property.id, { onDelete: 'cascade' })
            .notNull(),

        taxYear: integer('tax_year').notNull(),
        propertyTaxAmount: numeric('property_tax_amount', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }).notNull(),

        assessedLandValue: numeric('assessed_land_value', {
            precision: 14,
            scale: 2,
            mode: 'number',
        }).notNull(),
        assessedImprovementValue: numeric('assessed_improvement_value', {
            precision: 14,
            scale: 2,
            mode: 'number',
        }).notNull(),
        assessedTotalValue: numeric('assessed_total_value', {
            precision: 14,
            scale: 2,
            mode: 'number',
        }).notNull(),

        marketValue: numeric('market_value', {
            precision: 14,
            scale: 2,
            mode: 'number',
        }),
        taxRate: numeric('tax_rate', {
            precision: 6,
            scale: 4,
            mode: 'number',
        }),
        exemptions: numeric('exemptions', {
            precision: 12,
            scale: 2,
            mode: 'number',
        }),
        exemptionType: text('exemption_type'),
        paidStatus: taxPaidStatusEnum('paid_status')
            .notNull()
            .default('unknown'),
        source: text('source').notNull(),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex('tax_history_property_year_uidx').on(
            t.propertyId,
            t.taxYear,
        ),
        check('tax_history_year_chk', sql`${t.taxYear} BETWEEN 1800 AND 2200`),
        check('tax_history_tax_chk', sql`${t.propertyTaxAmount} >= 0`),
        check(
            'tax_history_values_chk',
            sql`${t.assessedLandValue} >= 0 AND ${t.assessedImprovementValue} >= 0 AND ${t.assessedTotalValue} >= 0`,
        ),
    ],
);
