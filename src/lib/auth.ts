import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';

import { db } from './db';
import * as schema from '../db/schema/auth';
import { ac, admin, agent, user } from '@/auth/permissions';
import { sendEmail } from './email';

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'pg', schema }),
    baseURL: process.env.BETTER_AUTH_URL as string,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
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
