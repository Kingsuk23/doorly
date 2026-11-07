import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

export const featureCategory = pgTable(
    'feature_categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        icon: text('icon'),
        sortOrder: integer('sort_order').notNull().default(0),
        isActive: boolean('is_active').notNull().default(true),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        uniqueIndex('feature_categories_slug_uidx').on(t.slug),
        uniqueIndex('feature_categories_name_uidx').on(t.name),
    ],
);
