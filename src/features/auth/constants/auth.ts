import { AuthView } from '../types';

export const AUTH_VIEW_TEXT: Record<
    AuthView,
    { title: string; description: string }
> = {
    'sign-in': {
        title: 'Welcome to Doorly',
        description: 'Join Doorly for free to discover more properties',
    },
    'sign-up': {
        title: 'Create your account',
        description: 'It only takes a minute to get started',
    },
    forgot: {
        title: 'Reset your password',
        description: "Enter your email and we'll send you a reset link",
    },
};
