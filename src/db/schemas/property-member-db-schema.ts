import { pgEnum, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { property } from './property-db-schema';
import { user } from './user-db-schema';

export const propertyMemberEnum = pgEnum('property_member_enum', [
    'owner',
    'agent',
]);
export const propertyMemberStatusEnum = pgEnum('property_member_status_enum', [
    'pending',
    'approved',
    'revoked',
]);

export const propertyMember = pgTable(
    'property_member',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        propertyId: uuid('property_id').references(() => property.id, {
            onDelete: 'cascade',
        }),
        userId: uuid('user_id').references(() => user.id, {
            onDelete: 'cascade',
        }),
        role: propertyMemberEnum('role').default('owner').notNull(),
        status: propertyMemberStatusEnum('status').notNull().default('pending'),
    },
    (t) => [
        uniqueIndex('property_member_property_user_uidx').on(
            t.propertyId,
            t.userId,
        ),
    ],
);
