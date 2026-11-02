import { defineRelations } from 'drizzle-orm';
import schema from '../schema/index';

export const relations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
        agent: r.one.agent({
            from: r.user.id,
            to: r.agent.userId,
            optional: true,
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
    agent: {
        user: r.one.user({
            from: r.agent.userId,
            to: r.user.id,
        }),
        agency: r.one.agency({
            from: r.agent.agencyId,
            to: r.agency.id,
            optional: true,
        }),
    },
    agency: {
        agents: r.many.agent({
            from: r.agency.id,
            to: r.agent.agencyId,
        }),
        city: r.one.city({
            from: r.agency.cityId,
            to: r.city.id,
        }),
        postalCode: r.one.postalCode({
            from: r.agency.postalCodeId,
            to: r.postalCode.id,
            optional: true,
        }),
        verifier: r.one.user({
            from: r.agency.verifiedBy,
            to: r.user.id,
            optional: true,
        }),
    },
    country: {
        states: r.many.state(),
    },
    state: {
        country: r.one.country({
            from: r.state.countryId,
            to: r.country.id,
        }),
        cities: r.many.city(),
    },
    city: {
        state: r.one.state({
            from: r.city.stateId,
            to: r.state.id,
        }),
        postalCodes: r.many.postalCode(),
    },
    postalCode: {
        city: r.one.city({
            from: r.postalCode.cityId,
            to: r.city.id,
        }),
    },
    address: {
        city: r.one.city({
            from: r.address.cityId,
            to: r.city.id,
        }),
        postalCode: r.one.postalCode({
            from: r.address.postalCodeId,
            to: r.postalCode.id,
            optional: true,
        }),
    },
}));
