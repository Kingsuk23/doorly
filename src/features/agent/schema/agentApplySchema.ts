import { agencyRole } from '@/db/schema/agent';
import { z } from 'zod';

export const applyAgentSchema = z.object({
    license: z.string().min(3, 'License number is required'),
    imageUrl: z.string().url('Upload your license document'),
    phone: z.string().min(7, 'Enter a valid phone number'),
    email: z.string().email('Enter a valid email'),
    bio: z.string().max(1000).optional(),
    website: z.string().url().optional().or(z.literal('')),
    agency: z.string(),
    agencyRole: z.enum(agencyRole.enumValues).default('agent'),
});

export type ApplyAgentInput = z.infer<typeof applyAgentSchema>;
