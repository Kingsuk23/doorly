import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    pgEnum,
    check,
    boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { listing } from './listing';
import { property } from './property';
import { agent } from './agent';

export const openHouseTypeEnum = pgEnum('open_house_type', [
    'in_person',
    'virtual',
    'hybrid',
]);
export const openHouseStatusEnum = pgEnum('open_house_status', [
    'scheduled',
    'cancelled',
    'completed',
]);

export const openHouse = pgTable(
    'open_houses',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        propertyId: uuid('property_id')
            .references(() => property.id, { onDelete: 'cascade' })
            .notNull(),
        listingId: uuid('listing_id').references(() => listing.id, {
            onDelete: 'set null',
        }),
        agentId: uuid('agent_id').references(() => agent.id, {
            onDelete: 'set null',
        }),

        startTime: timestamp('start_time', { withTimezone: true }).notNull(),
        endTime: timestamp('end_time', { withTimezone: true }).notNull(),
        timezone: text('timezone').notNull(),

        type: openHouseTypeEnum('type').notNull().default('in_person'),
        virtualLink: text('virtual_link'),
        status: openHouseStatusEnum('status').notNull().default('scheduled'),
        description: text('description'),
        maxAttendees: integer('max_attendees'),

        isRecurring: boolean('is_recurring').notNull().default(false),
        recurrenceRule: text('recurrence_rule'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index('open_houses_property_idx').on(t.propertyId),
        index('open_houses_listing_idx').on(t.listingId),
        index('open_houses_agent_idx').on(t.agentId),
        index('open_houses_start_time_idx').on(t.startTime),
        check('open_houses_time_chk', sql`${t.endTime} > ${t.startTime}`),
        check(
            'open_houses_max_chk',
            sql`${t.maxAttendees} IS NULL OR ${t.maxAttendees} > 0`,
        ),
        check(
            'open_houses_virtual_chk',
            sql`${t.type} = 'in_person' OR ${t.virtualLink} IS NOT NULL`,
        ),
        check(
            'open_houses_recurrence_chk',
            sql`${t.isRecurring} = true OR ${t.recurrenceRule} IS NULL`,
        ),
    ],
);
