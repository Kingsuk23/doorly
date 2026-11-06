import { agencyRole } from '@/db/schema/agent';
import { z } from 'zod';

export const applyAgentBasicSchema = z.object({
    license: z.string().min(3, 'License number is required'),
    phone: z.string().min(7, 'Enter a valid phone number'),
    email: z.string().email('Enter a valid email'),
    bio: z.string().max(1000).optional(),
    website: z.string().url().optional().or(z.literal('')),
    agency: z.string(),
    agencyRole: z.enum(agencyRole.enumValues).default('agent'),
});

export const applyAgentImageSchema = z.object({
    imageUrl: z.string().url('Upload your profile image'),
});

export type ApplyAgentBasicInput = z.infer<typeof applyAgentBasicSchema>;
export type ApplyAgentImageInput = z.infer<typeof applyAgentImageSchema>;

export type AgentFormValues = ApplyAgentBasicInput & ApplyAgentImageInput;

export const emptyAgentForm: AgentFormValues = {
    agency: '',
    agencyRole: 'agent',
    email: '',
    imageUrl: '',
    license: '',
    phone: '',
    bio: '',
    website: '',
};
