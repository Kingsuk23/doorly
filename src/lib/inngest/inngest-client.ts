import { inngestInviteIdSchema } from '@/features/invities/schemas/zod-invite-schemas';
import { eventType, Inngest } from 'inngest';

export const inngest = new Inngest({
    id: 'doorly',
});

export const invitePush = eventType('invite/created', {
    schema: inngestInviteIdSchema,
});
