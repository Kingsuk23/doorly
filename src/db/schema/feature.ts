import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { featureCategory } from './featureCategory';

export const feature = pgTable(
    'features',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        categoryId: uuid('category_id')
            .references(() => featureCategory.id, { onDelete: 'restrict' })
            .notNull(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        isSearchable: boolean('is_searchable').notNull().default(false),
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
        index('features_category_idx').on(t.categoryId),
        uniqueIndex('features_slug_uidx').on(t.slug),
        uniqueIndex('features_name_uidx').on(t.name),
    ],
);
