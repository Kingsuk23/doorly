import { z } from 'zod';

export const brokerAvatarInfoSchema = z.object({
    avatar: z.object({ url: z.string().url(), fileId: z.string() }),
});

export type brokerAvatarInfoInput = z.infer<typeof brokerAvatarInfoSchema>;
