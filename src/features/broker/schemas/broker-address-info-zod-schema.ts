import { z } from 'zod';

export const brokerAddressInfoSchema = z.object({
    street_address_1: z.string().trim(),
    street_address_2: z.string().trim().optional(),
    city: z.string().trim(),
    zip_code: z.string().trim(),
    country: z.string().trim(),
    state: z.string().trim(),
    country_code: z.string().length(2).optional(),
    state_code: z.string().max(10).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type brokerAddressInfoInput = z.infer<typeof brokerAddressInfoSchema>;
