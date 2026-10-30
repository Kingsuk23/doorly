import { defineRelations } from 'drizzle-orm';

import * as schema from '../schema/auth';

export const userRelations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
    },
    session: {
        users: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        users: r.one.user({
            from: r.account.userId,
            to: r.user.emailVerified,
        }),
    },
}));
