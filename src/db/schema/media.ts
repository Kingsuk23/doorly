import {
    boolean,
    check,
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

import { property } from './property';
import { listing } from './listing';
import { agent } from './agent';

export const mediaTypeEnum = pgEnum('media_type', [
    'photo',
    'video',
    'virtual_tour',
    'floor_plan',
    'drone',
]);
export const roomTypeEnum = pgEnum('room_type', [
    'kitchen',
    'bedroom',
    'bathroom',
    'exterior',
]);

export const media = pgTable(
    'media',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        propertyId: uuid('property_id')
            .references(() => property.id)
            .notNull(),
        listingId: uuid('listing_id').references(() => listing.id),
        mediaType: mediaTypeEnum('media_type').notNull(),
        url: text('url').notNull(),
        thumbnailUrl: text('thumbnail_url').notNull(),
        title: text('title').notNull(),
        roomType: roomTypeEnum('room_type').notNull(),
        sortOrder: integer('sort_order').notNull(),
        isPrimary: boolean('is_primary').notNull().default(false),
        width: integer('width').notNull(),
        height: integer('height').notNull(),
        fileSize: integer('file_size').notNull(),
        mimeType: text('mime_type'),
        durationSeconds: integer('duration_seconds'),
        uploadedBy: uuid('upload_by')
            .references(() => agent.id)
            .notNull(),

        deletedAt: timestamp('deleted_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index('media_property_sort_idx').on(t.propertyId, t.sortOrder),
        index('media_listing_idx').on(t.listingId),
        index('media_uploaded_by_idx').on(t.uploadedBy),
        uniqueIndex('media_one_primary_per_property_uidx')
            .on(t.propertyId)
            .where(sql`${t.isPrimary} = true AND ${t.deletedAt} IS NULL`),
        check('media_sort_order_chk', sql`${t.sortOrder} >= 0`),
        check('media_width_chk', sql`${t.width} IS NULL OR ${t.width} > 0`),
        check('media_height_chk', sql`${t.height} IS NULL OR ${t.height} > 0`),
        check(
            'media_file_size_chk',
            sql`${t.fileSize} IS NULL OR ${t.fileSize} > 0`,
        ),
        check(
            'media_duration_chk',
            sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`,
        ),
    ],
);
