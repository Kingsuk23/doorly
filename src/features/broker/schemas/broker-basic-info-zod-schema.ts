import { z } from 'zod';

export const brokerBasicInfoSchema = z.object({
    name: z.string().trim().min(3).max(100),

    license: z.string().trim().min(1),
    description: z.string().trim().max(500).optional(),
});

export type brokerBasicInfoInput = z.infer<typeof brokerBasicInfoSchema>;
