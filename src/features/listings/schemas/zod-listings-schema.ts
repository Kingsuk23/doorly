import {
    listingStatusEnum,
    listingTypeEnum,
} from '@/db/schemas/listing-db-schema';
import { z } from 'zod';

export const basicsSchema = z.object({
    listing_type: z.enum(listingTypeEnum.enumValues),
    title: z.string().min(5, 'Title is too short').max(120),
    description: z.string().min(20, 'Add a bit more detail').max(5000),
    mls_number: z.string().trim().min(1).optional(),
});

export const pricingSchema = z.object({
    price: z.coerce.number().positive('Price must be greater than 0'),
    currency: z.string().length(3).default('USD'),
    price_per_sqft: z.coerce.number().positive().optional(),
});

export const scheduleSchema = z
    .object({
        listed_at: z.coerce.date().optional(),
        expires_at: z.coerce.date().optional(),
    })
    .refine(
        (d) => !d.listed_at || !d.expires_at || d.expires_at > d.listed_at,
        {
            message: 'Expiry must be after the listing date',
            path: ['expires_at'],
        },
    );

export const publishSchema = z.object({
    status: z.enum(listingStatusEnum.enumValues).default('draft'),
});

export const listingFormSchema = z.object({
    ...basicsSchema.shape,
    ...pricingSchema.shape,
    ...scheduleSchema.shape,
    ...publishSchema.shape,
});

export const partialListingFormSchema = listingFormSchema.partial();

export type partialListingFormInput = z.infer<typeof partialListingFormSchema>;
export type basicsInput = z.infer<typeof basicsSchema>;
export type pricingInput = z.infer<typeof pricingSchema>;
export type scheduleInput = z.infer<typeof scheduleSchema>;
export type publishInput = z.infer<typeof publishSchema>;
