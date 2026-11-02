import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: [
        './src/db/schema/auth.ts',
        './src/db/schema/properties.ts',
        './src/db/schema/agent.ts',
        './src/db/schema/agency.ts',
        './src/db/schema/address.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
