import { address } from './address';
import { agency } from './agency';
import { agent, agencyRole } from './agent';
import { account, session, user } from './auth';
import { city, state, country, postalCode } from './location';

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
