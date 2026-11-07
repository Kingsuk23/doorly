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
        './src/db/schema/propertyType.ts',
        './src/db/schema/listing.ts',
        './src/db/schema/featuredListing.ts',
        './src/db/schema/virtualTour.ts',
        './src/db/schema/media.ts',
        './src/db/schema/feature.ts',
        './src/db/schema/featureCategory.ts',
        './src/db/schema/propertyFeature.ts',
        './src/db/schema/taxHistory.ts',
        './src/db/schema/priceHistory.ts',
        './src/db/schema/openHouse.ts',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
