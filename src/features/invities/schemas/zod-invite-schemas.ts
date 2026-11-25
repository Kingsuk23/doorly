import { z } from 'zod';

export const inngestInviteIdSchema = z.object({
    inviteId: z.string(),
});
