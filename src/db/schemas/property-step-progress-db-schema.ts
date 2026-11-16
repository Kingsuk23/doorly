import { pgTable, uuid, unique, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { property } from './property-db-schema';

export const propertyStepsEnum = pgEnum('property_steps_enum', [
    'location_c',
    'layout_c',
    'parking_systems_c',
    'ownership_legal_c',
    'description_c',
    'review_publish_c',
]);

export const propertyStepProgress = pgTable(
    'property_step_progress',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        propertyId: uuid('property_id')
            .notNull()
            .references(() => property.id, { onDelete: 'cascade' }),

        stepId: propertyStepsEnum('step_id').notNull(),
        completedAt: timestamp('complete_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [unique().on(t.propertyId, t.stepId)],
);
