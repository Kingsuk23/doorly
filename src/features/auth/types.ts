import { authClient } from '@/lib/auth/auth-client';

export type AuthView = 'sign-in' | 'sign-up' | 'forgot';

export type Session = typeof authClient.$Infer.Session;
