import { authClient } from '@/lib/auth/auth-client';

export type AuthView = 'sign-in' | 'sign-up' | 'forgot' | 'verify-email';

export type Session = typeof authClient.$Infer.Session;
