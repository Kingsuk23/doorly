import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: [
        './src/db/schema/auth.ts',
        './src/db/schema/property.ts',
        './src/db/schema/agent.ts',
        './src/db/schema/agency.ts',
        './src/db/schema/address.ts',
        './src/db/schema/location.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
