import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

import { ac, admin, agent, user } from '@/auth/permissions';

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL as string,
    plugins: [
        adminClient({
            ac,
            roles: {
                admin,
                agent,
                user,
            },
        }),
    ],
});
