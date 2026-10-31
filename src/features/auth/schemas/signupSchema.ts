import z from 'zod';

export const signupSchema = z.object({
    name: z.string().min(3, 'Name is too short'),
    email: z.email({ message: 'Invalid email' }),
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

export type signup = z.infer<typeof signupSchema>;
