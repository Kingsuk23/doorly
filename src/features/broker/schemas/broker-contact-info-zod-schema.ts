import { z } from 'zod';

export const brokerContactInfoSchema = z.object({
    email: z.email(),

    phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9\s().-]{7,20}$/),

    website: z.url().min(1),
});

export type brokerContactInfoInput = z.infer<typeof brokerContactInfoSchema>;
