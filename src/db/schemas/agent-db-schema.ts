import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './user-db-schema';
import { broker } from './broker-db-schema';

export const brokerRole = pgEnum('agency_role', ['agent', 'owner']);

export const agent = pgTable(
    'agent',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        userId: uuid('user_id')
            .references(() => user.id, { onDelete: 'cascade' })
            .notNull()
            .unique(),

        bio: text('bio'),
        rate: integer('rate'),

        brokerId: uuid('broker_id').references(() => broker.id, {
            onDelete: 'cascade',
        }),
        brokerRole: brokerRole('broker_role').default('agent').notNull(),

        license: text('license').notNull(),
        email: text('email').notNull(),
        phone: text('phone').notNull(),
        website: text('website'),

        isVerified: boolean('is_verified').default(false),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index('agent_agency_idx').on(table.brokerId),
        uniqueIndex('agent_one_owner_per_agency')
            .on(table.brokerId)
            .where(sql`${table.brokerRole} = 'owner'`),
    ],
);
