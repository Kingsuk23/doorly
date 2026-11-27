import { account } from './account-db-schema';
import { address } from './address-db-schema';
import { agent } from './agent-db-schema';
import { broker } from './broker-db-schema';
import { city, country, postalCode, state } from './location-db-schema';
import { propertyAgentInvite } from './property-agent-invite-db-schema';
import { property } from './property-db-schema';
import { propertyMember } from './property-member-db-schema';
import { propertyStepProgress } from './property-step-progress-db-schema';
import { propertyType } from './property-type-db-schema';
import { session } from './session-db-schema';
import { user } from './user-db-schema';
import { verification } from './verification-db-schema';
import { listing } from './listing-db-schema';
import { listingStepProgress } from './listing-step-progress-db-schema';

export const schemas = {
    user,
    session,
    account,
    verification,
    propertyStepProgress,
    property,
    propertyMember,
    address,
    propertyType,
    country,
    state,
    city,
    postalCode,
    broker,
    agent,
    propertyAgentInvite,
    listing,
    listingStepProgress,
};
