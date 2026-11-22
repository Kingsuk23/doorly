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

export type agentApplyFormInput = z.infer<typeof agentApplyFormSchema>;
