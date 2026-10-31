import z from 'zod';

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password at least 8 characters')
        .max(20, 'Max 20 characters')
        .refine(
            (rawPassword) => /[A-Z]/.test(rawPassword),
            'Must contain an uppercase letter',
        )
        .refine(
            (rawPassword) => /[a-z]/.test(rawPassword),
            'Must contain an lowercase letter',
        )
        .refine(
            (rawPassword) => /[0-9]/.test(rawPassword),
            'Must contain an number',
        )
        .refine(
            (rawPassword) => /[!@#$%^&*]/.test(rawPassword),
            'Must contain an spacial character',
        ),
});

export type resetPassword = z.infer<typeof resetPasswordSchema>;
