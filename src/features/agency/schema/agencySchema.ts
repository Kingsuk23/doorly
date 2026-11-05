import { z } from 'zod';

const requiredString = (label: string) =>
    z
        .string({ error: `${label} is required` })
        .trim()
        .min(1, `${label} is required`);

export const agencyBasicSchema = z.object({
    name: z
        .string({ error: 'Agency name is required' })
        .trim()
        .min(3, 'Agency name must be at least 3 characters')
        .max(100, 'Agency name must be at most 100 characters'),

    license: requiredString('License number'),

    description: z
        .string()
        .trim()
        .max(500, 'Description must be at most 500 characters')
        .optional(),
});

export const agencyContactSchema = z.object({
    email: z.email('Enter a valid email address'),

    phone: z
        .string({ error: 'Phone number is required' })
        .trim()
        .regex(/^\+?[0-9\s().-]{7,20}$/, 'Enter a valid phone number'),

    website: z.url('Enter a valid website URL (https://...)').or(z.literal('')),
});

export const agencyAddressSchema = z.object({
    streetLine1: requiredString('Street address'),
    streetLine2: z.string().trim().optional(),
    city: requiredString('City'),
    postalCode: requiredString('Postal code'),
});

export const agencyProfileImageSchema = z.object({
    logoUrl: z.url('Enter a valid logo URL (https://...)').or(z.literal('')),
});

export type agencyBasicInput = z.infer<typeof agencyBasicSchema>;
export type agencyContactInput = z.infer<typeof agencyContactSchema>;
export type agencyAddressInput = z.infer<typeof agencyAddressSchema>;
export type agencyProfileImageInput = z.infer<typeof agencyProfileImageSchema>;

export type AgencyFormValues = agencyBasicInput &
    agencyContactInput &
    agencyAddressInput &
    agencyProfileImageInput & {
        lat: number | undefined;
        lon: number | undefined;
    };

export const emptyAgencyForm = {
    name: '',
    description: '',
    license: '',
    email: '',
    phone: '',
    website: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    postalCode: '',
    logoUrl: '',
    lat: undefined,
    lon: undefined,
};
