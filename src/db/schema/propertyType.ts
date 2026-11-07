import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

export const propertyType = pgTable(
    'property_type',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        description: text('description'),
        icon: text('icon').notNull(),
        isActive: boolean('is_active').notNull().default(true),
        sortOrder: integer('sort_order').notNull().default(0),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex('property_type_slug_uidx').on(t.slug),
        uniqueIndex('property_types_name_uidx').on(t.name),
    ],
);
