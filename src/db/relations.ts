import { defineRelations } from 'drizzle-orm';

import { schemas } from './schemas';

export const relations = defineRelations(schemas, (r) => ({
    user: {
        sessions: r.many.session({
            from: r.user.id,
            to: r.session.userId,
        }),
        accounts: r.many.account({
            from: r.user.id,
            to: r.account.userId,
        }),
        propertyMember: r.many.propertyMember({
            from: r.user.id,
            to: r.propertyMember.userId,
        }),
        agent: r.one.agent({
            from: r.user.id,
            to: r.agent.userId,
        }),
        sentInvites: r.many.propertyAgentInvite({
            from: r.user.id,
            to: r.propertyAgentInvite.ownerId,
            alias: 'invite_owner',
        }),
        receivedInvites: r.many.propertyAgentInvite({
            from: r.user.id,
            to: r.propertyAgentInvite.agentUserId,
            alias: 'invite_agent',
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

    property: {
        propertyMember: r.many.propertyMember({
            from: r.property.id,
            to: r.propertyMember.propertyId,
        }),

        address: r.one.address({
            from: r.property.addressId,
            to: r.address.id,
        }),

        propertyType: r.one.propertyType({
            from: r.property.propertyTypeId,
            to: r.propertyType.id,
        }),

        propertyStepProgress: r.one.propertyStepProgress({
            from: r.property.id,
            to: r.propertyStepProgress.propertyId,
        }),

        invites: r.many.propertyAgentInvite({
            from: r.property.id,
            to: r.propertyAgentInvite.propertyId,
        }),

        listing: r.one.listing({
            from: r.property.id,
            to: r.listing.propertyId,
        }),
    },

    propertyType: {
        property: r.many.property({
            from: r.propertyType.id,
            to: r.property.propertyTypeId,
        }),
    },

    propertyStepProgress: {
        property: r.one.property({
            from: r.propertyStepProgress.propertyId,
            to: r.property.id,
        }),
    },

    propertyMember: {
        property: r.one.property({
            from: r.propertyMember.propertyId,
            to: r.property.id,
        }),
        user: r.one.user({
            from: r.propertyMember.userId,
            to: r.user.id,
        }),
    },

    country: {
        state: r.many.state({
            from: r.country.id,
            to: r.state.countryId,
        }),
    },

    state: {
        country: r.one.country({
            from: r.state.countryId,
            to: r.country.id,
        }),
        city: r.many.city({
            from: r.state.id,
            to: r.city.stateId,
        }),
    },

    city: {
        state: r.one.state({
            from: r.city.stateId,
            to: r.state.id,
        }),

        postalCode: r.many.postalCode({
            from: r.city.id,
            to: r.postalCode.cityId,
        }),

        address: r.many.address({
            from: r.city.id,
            to: r.address.cityId,
        }),
    },

    postalCode: {
        city: r.one.city({
            from: r.postalCode.cityId,
            to: r.city.id,
        }),

        address: r.many.address({
            from: r.postalCode.id,
            to: r.address.postalCodeId,
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
        }),

        property: r.one.property({
            from: r.address.id,
            to: r.property.addressId,
        }),
    },

    agent: {
        user: r.one.user({
            from: r.agent.userId,
            to: r.user.id,
        }),
        broker: r.one.broker({
            from: r.agent.brokerId,
            to: r.broker.id,
        }),
        listing: r.one.listing({ from: r.agent.id, to: r.listing.agentId }),
    },

    broker: {
        agent: r.many.agent({
            from: r.broker.id,
            to: r.agent.brokerId,
        }),
    },

    propertyAgentInvite: {
        property: r.one.property({
            from: r.propertyAgentInvite.propertyId,
            to: r.property.id,
            optional: false,
        }),
        owner: r.one.user({
            from: r.propertyAgentInvite.ownerId,
            to: r.user.id,
            alias: 'invite_owner',
            optional: false,
        }),

        agentUser: r.one.user({
            from: r.propertyAgentInvite.agentUserId,
            to: r.user.id,
            alias: 'invite_agent',
            optional: false,
        }),

        agent: r.one.agent({
            from: r.propertyAgentInvite.agentUserId,
            to: r.agent.userId,
        }),
    },

    listing: {
        property: r.one.property({
            from: r.listing.propertyId,
            to: r.property.id,
        }),

        agent: r.one.agent({
            from: r.listing.agentId,
            to: r.agent.id,
        }),
    },
}));
