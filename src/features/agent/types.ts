import { listingType } from '@/db/schemas/listing-db-schema';

export type listingRow = Omit<
    listingType,
    | 'agentId'
    | 'updatedAt'
    | 'currency'
    | 'price_per_sqft'
    | 'sold_at'
    | 'mls_number'
    | 'description'
    | 'createdAt'
    | 'expires_at'
    | 'sold_price'
>;
