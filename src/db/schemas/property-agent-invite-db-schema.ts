import {
    pgTable,
    pgEnum,
    uuid,
    text,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { property } from './property-db-schema';
import { user } from './user-db-schema';
import { agent } from './agent-db-schema';

export const inviteStatus = pgEnum('invite_status', [
    'pending',
    'accepted',
    'declined',
    'cancelled',
    'expired',
]);

export const propertyAgentInvite = pgTable(
    'property_agent_invite',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        propertyId: uuid('property_id')
            .notNull()
            .references(() => property.id, { onDelete: 'cascade' }),

        ownerId: uuid('owner_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),

        agentId: uuid('agent_id')
            .notNull()
            .references(() => agent.id, { onDelete: 'cascade' }),

        status: inviteStatus('status').notNull().default('pending'),
        message: text('message'),

        expiresAt: timestamp('expires_at')
            .notNull()
            .default(sql`now() + interval '20 days'`),
        respondedAt: timestamp('responded_at'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at')
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex('uniq_pending_invite')
            .on(t.propertyId, t.agentId)
            .where(sql`${t.status} = 'pending'`),
        index('invite_agent_status_idx').on(t.agentId, t.status),
        index('invite_owner_idx').on(t.ownerId),
    ],
);
