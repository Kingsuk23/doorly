import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    numeric,
    uniqueIndex,
    check,
    pgEnum,
} from 'drizzle-orm/pg-core';

import { address } from './address-db-schema';
import { sql } from 'drizzle-orm';
import { propertyType } from './property-type-db-schema';

export const propertyMemberReleaseStatusEnum = pgEnum(
    'property_member_release_status_enum',
    ['draft', 'publish', 'hidden'],
);

export const property = pgTable(
    'properties',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        propertyTypeId: uuid('property_type_id').references(
            () => propertyType.id,
            { onDelete: 'cascade' },
        ),

        addressId: uuid('address_id').references(() => address.id, {
            onDelete: 'cascade',
        }),

        ownerName: text('owner_name'),
        yearBuilt: integer('year_built'),

        bedrooms: integer('bedrooms'),
        bathrooms: numeric('bathrooms', { precision: 3, scale: 1 }),

        livingAreaSqft: numeric('living_area_sqft', {
            precision: 10,
            scale: 2,
        }),
        lotSizeSqft: numeric('lot_size_sqft', { precision: 10, scale: 2 }),

        floors: integer('floors'),
        unitNumber: text('unit_number'),
        parkingSpaces: integer('parking_spaces'),
        garageSpaces: integer('garage_spaces'),
        heatingType: text('heating_type'),
        coolingType: text('cooling_type'),
        hoaName: text('hoa_name'),
        parcelNumber: text('parcel_number').unique(),
        zoning: text('zoning'),
        description: text('description'),

        releaseStatus: propertyMemberReleaseStatusEnum('release_status')
            .default('draft')
            .notNull(),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [
        index('properties_type_idx').on(t.propertyTypeId),
        index('properties_address_idx').on(t.addressId),
        uniqueIndex('properties_address_unit_uidx').on(
            t.addressId,
            t.unitNumber,
        ),
        check('properties_bedrooms_chk', sql`${t.bedrooms} >= 0`),
        check('properties_bathrooms_chk', sql`${t.bathrooms} >= 0`),
        check(
            'properties_year_built_chk',
            sql`${t.yearBuilt} IS NULL OR ${t.yearBuilt} BETWEEN 1600 AND 2200`,
        ),
    ],
);
