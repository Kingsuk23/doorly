import { account } from './account-db-schema';
import { session } from './session-db-schema';
import { user } from './user-db-schema';
import { verification } from './verification-db-schema';

export const schemas = {
    user,
    session,
    account,
    verification,
};
