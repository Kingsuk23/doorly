import { z } from 'zod';

import { brokerRole } from '@/db/schemas/agent-db-schema';

export const agentApplyFormSchema = z.object({
    license: z.string().min(3, 'License number is required'),
    phone: z.string().min(7, 'Enter a valid phone number'),
    email: z.string().email('Enter a valid email'),
    bio: z.string().max(1000).optional(),
    website: z.string().url().optional().or(z.literal('')),
    broker: z.string(),
    broker_role: z.enum(brokerRole.enumValues).default('agent'),
});

export const agentInfoUpdateFormSchema = z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(7, 'Enter a valid phone number').optional(),
    email: z.string().email('Enter a valid email').optional(),
    bio: z.string().max(1000).optional(),
    website: z.string().url().optional().or(z.literal('')),
    avatar: z
        .object({ url: z.string().url(), fileId: z.string() })
        .nullable()
        .optional(),
});

export type agentApplyFormInput = z.infer<typeof agentApplyFormSchema>;

export type agentInfoUpdateFormInput = z.infer<
    typeof agentInfoUpdateFormSchema
>;
