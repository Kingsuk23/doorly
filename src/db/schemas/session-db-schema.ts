import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user-db-schema';

export const session = pgTable(
    'session',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),

        userId: uuid('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        impersonatedBy: text('impersonated_by'),

        token: text('token').notNull().unique(),
        expiresAt: timestamp('expires_at').notNull(),

        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index('session_userId_idx').on(table.userId)],
);
