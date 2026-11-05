import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const propertiesTable = pgTable('properties', {
    id: uuid('id').primaryKey().defaultRandom(),
});
