import { address, city, state, country, postalCode } from './address';
import { agency } from './agency';
import { agent, agencyRole } from './agent';
import { account, session, user } from './auth';

const schema = {
    user,
    account,
    session,
    agent,
    agencyRole,
    agency,
    address,
    city,
    state,
    country,
    postalCode,
};

export default schema;
