import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: [
        './src/db/schemas/user-db-schema.ts',
        './src/db/schemas/account-db-schema.ts',
        './src/db/schemas/session-db-schema.ts',
        './src/db/schemas/verification-db-schema.ts',
        './src/db/schemas/property-type-db-schema.ts',
        './src/db/schemas/property-step-progress-db-schema.ts',
        './src/db/schemas/property-member-db-schema.ts',
        './src/db/schemas/property-db-schema.ts',
        './src/db/schemas/address-db-schema.ts',
        './src/db/schemas/location-db-schema.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
