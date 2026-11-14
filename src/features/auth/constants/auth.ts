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

        case 'update-user-info':
            return {
                title: 'Edit your profile',
                description: 'Change your name or profile picture.',
            };
        case 'update-email':
            return {
                title: 'Change your email',
                description:
                    'Enter the new email address you want to use for your account.',
            };
        case 'update-email-sent':
            return {
                title: 'Confirm your new email',
                description: email
                    ? `We sent a confirmation link to ${email}. Click it to switch your account to this address.`
                    : 'We sent a confirmation link to your new email address. Click it to complete the change.',
            };
        case 'update-password':
            return {
                title: 'Change your password',
                description:
                    'Enter your current password and choose a new one.',
            };
        case 'delete-user':
            return {
                title: 'Delete your account',
                description:
                    'This permanently deletes your account and data. This cannot be undone.',
            };
    }
};

export const COOLDOWN_SECONDS = 60;
