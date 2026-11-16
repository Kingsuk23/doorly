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

export const sizeAndLayoutSchema = z.object({
    bedrooms: z.number(),
    bathrooms: z.number(),
    build_year: z.number(),
    floors: z.number().optional(),
    living_area: z.string(),
    lot_size: z.string().optional(),
});

export const parkingAndSystemSchema = z.object({
    cooling_type: z.string().optional(),
    heating_type: z.string().optional(),
    garage_spaces: z.number().optional(),
    parking_spaces: z.number().optional(),
});

export const ownershipAndLegalSchema = z.object({
    owner_name: z.string().optional(),
    hoa_name: z.string().optional(),
    zoning: z.string().optional(),
});

export type typeAndLocationInput = z.infer<typeof typeAndLocationSchema>;
export type sizeAndLayoutInput = z.infer<typeof sizeAndLayoutSchema>;
export type parkingAndSystemInput = z.infer<typeof parkingAndSystemSchema>;
export type ownershipAndLegalInput = z.infer<typeof ownershipAndLegalSchema>;
