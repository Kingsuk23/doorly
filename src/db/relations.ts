import { defineRelations } from 'drizzle-orm';

import { user } from './schemas/user-db-schema';
import { session } from './schemas/session-db-schema';
import { account } from './schemas/account-db-schema';

export const relations = defineRelations({ user, session, account }, (r) => ({
    user: {
        sessions: r.many.session({
            from: r.user.id,
            to: r.session.userId,
        }),
        accounts: r.many.account({
            from: r.user.id,
            to: r.account.userId,
        }),
    },
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id,
        }),
    },
}));
