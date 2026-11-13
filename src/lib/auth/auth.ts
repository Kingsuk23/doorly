import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';

import { db } from '@/db';
import { schemas } from '@/db/schemas';
import { sendVerificationEmail } from './send-verification-email';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schemas,
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 10,
        revokeSessionsOnPasswordReset: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({
                to: user.email,
                verifyUrl: url,
                name: user?.name,
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    advanced: {
        database: {
            generateId: 'uuid',
        },
    },
    plugins: [admin()],
});
