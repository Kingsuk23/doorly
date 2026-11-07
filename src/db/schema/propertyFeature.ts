import {
    index,
    pgTable,
    primaryKey,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { property } from './property';
import { feature } from './feature';

export const propertyFeature = pgTable(
    'property_features',
    {
        propertyId: uuid('property_id')
            .references(() => property.id, { onDelete: 'cascade' })
            .notNull(),
        featureId: uuid('feature_id')
            .references(() => feature.id, { onDelete: 'restrict' })
            .notNull(),

        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        primaryKey({ columns: [t.propertyId, t.featureId] }),
        index('property_features_feature_idx').on(t.featureId),
    ],
);
