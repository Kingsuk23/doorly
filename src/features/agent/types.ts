import { listingType } from '@/db/schemas/listing-db-schema';
import { listingStepProgressType } from '@/db/schemas/listing-step-progress-db-schema';

export type listingRow = Omit<
    listingType & { listingStepProgress: listingStepProgressType | null },
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
