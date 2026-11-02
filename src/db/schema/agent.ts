import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { agency } from './agency';
import { sql } from 'drizzle-orm';

export const agencyRole = pgEnum('agency_role', [
    'agent',
    'owner',
    'president',
    'vice president',
    'manger',
]);

export const agent = pgTable(
    'agent',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        userId: uuid('user_id')
            .references(() => user.id)
            .notNull()
            .unique(),

        bio: text('bio'),
        rate: integer('rate'),

        agencyId: uuid('agency_id').references(() => agency.id),
        agencyRole: agencyRole('agency_role').default('agent').notNull(),

        license: text('license').notNull(),
        email: text('email').notNull(),
        phone: text('phone').notNull(),
        website: text('website'),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index('agent_agency_idx').on(table.agencyId),
        uniqueIndex('agent_one_owner_per_agency')
            .on(table.agencyId)
            .where(sql`${table.agencyRole} = 'owner'`),
    ],
);
