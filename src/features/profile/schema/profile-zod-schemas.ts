import { z } from 'zod';

export const updatePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z
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

export const changeEmailSchema = z.object({
    email: z.email(),
});

export const passwordVerificationSchema = z.object({
    password: z.string(),
});

export type updatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type changeEmailInput = z.infer<typeof changeEmailSchema>;
export type passwordVerificationInput = z.infer<
    typeof passwordVerificationSchema
>;
