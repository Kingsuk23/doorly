import { pgTable, uuid, unique, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { listing } from './listing-db-schema';

export const listingStepsEnum = pgEnum('listing_steps_enum', [
    'basic_c',
    'pricing_c',
    'schedule_c',
    'media_c',
    'review_publish_c',
]);

export const listingStepProgress = pgTable(
    'listing_step_progress',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        listingId: uuid('listing_id')
            .notNull()
            .references(() => listing.id, { onDelete: 'cascade' }),

        stepId: listingStepsEnum('step_id').notNull(),
        completedAt: timestamp('complete_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [unique().on(t.listingId, t.stepId)],
);

export type listingStepProgressType = typeof listingStepProgress.$inferSelect;
