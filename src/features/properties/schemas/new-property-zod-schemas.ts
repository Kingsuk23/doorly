import { z } from 'zod';

export const typeAndLocationSchema = z.object({
    property_type: z.string(),
    street_address_1: z.string(),
    street_address_2: z.string().optional(),
    city: z.string(),
    zip_code: z.string(),
    parcel_number: z.string().optional(),
    country: z.string(),
    state: z.string(),
    country_code: z.string().length(2).optional(),
    state_code: z.string().max(10).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type typeAndLocationInput = z.infer<typeof typeAndLocationSchema>;
