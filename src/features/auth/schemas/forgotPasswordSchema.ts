import z from 'zod';

export const forgotPasswordSchema = z.object({
    email: z.email({ message: 'Invalid email' }),
});

export type forgotPassword = z.infer<typeof forgotPasswordSchema>;
