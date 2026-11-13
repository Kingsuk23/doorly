import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: [
        './src/db/schemas/user-db-schema.ts',
        './src/db/schemas/account-db-schema.ts',
        './src/db/schemas/session-db-schema.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
