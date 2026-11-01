import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';

import { db } from './db';
import * as schema from '../db/schema/auth';
import { ac, admin, agent, user } from '@/auth/permissions';
import { sendEmail } from './email';

const DEFAULT_AVATAR =
    'https://ui-avatars.com/api/?background=random&length=1&name=';

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'pg', schema }),
    baseURL: process.env.BETTER_AUTH_URL as string,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 10,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Reset your password',
                html: `<p>Click to reset your password:</p><a href="${url}">Reset password</a>`,
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your email',
                html: `<p>Hi ${user.name}, click to verify your account:</p>
               <a href="${url}">Verify email</a>`,
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },

    socialProviders: {
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'facebook'],
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            image:
                                user.image ??
                                `${DEFAULT_AVATAR}${encodeURIComponent(user.name)}`,
                        },
                    };
                },
            },
        },
    },
    plugins: [
        adminPlugin({
            ac,
            roles: {
                admin,
                agent,
                user,
            },
        }),
    ],
});
