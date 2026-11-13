import { AuthView } from '../types';

type ViewText = { title: string; description: string };

export const getAuthViewText = (view: AuthView, email?: string): ViewText => {
    switch (view) {
        case 'sign-in':
            return {
                title: 'Welcome to Doorly',
                description: 'Join Doorly for free to discover more properties',
            };
        case 'sign-up':
            return {
                title: 'Create your account',
                description: 'It only takes a minute to get started',
            };
        case 'forgot':
            return {
                title: 'Reset your password',
                description: "Enter your email and we'll send you a reset link",
            };
        case 'verify-email':
            return {
                title: 'Check your inbox',
                description: email
                    ? `We sent a verification link to ${email} to finish your account setup.`
                    : 'We sent a verification link to your inbox. Click it to finish setting up your account.',
            };
    }
};

export const COOLDOWN_SECONDS = 60;
