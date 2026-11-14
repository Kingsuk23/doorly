import { authClient } from '@/lib/auth/auth-client';

export type AuthView =
    | 'sign-in'
    | 'sign-up'
    | 'forgot'
    | 'verify-email'
    | 'update-user-info'
    | 'update-email'
    | 'update-email-sent'
    | 'update-password'
    | 'delete-user';

export type Session = typeof authClient.$Infer.Session;
