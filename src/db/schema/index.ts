import { address } from './address';
import { agency } from './agency';
import { agent, agencyRole } from './agent';
import { account, session, user } from './auth';
import { feature } from './feature';
import { featureCategory } from './featureCategory';
import { featuredListing } from './featuredListing';
import { listing } from './listing';
import { city, state, country, postalCode } from './location';
import { media } from './media';
import { openHouse } from './openHouse';
import { priceHistory } from './priceHistory';
import { property } from './property';
import { propertyFeature } from './propertyFeature';
import { propertyType } from './propertyType';
import { taxHistory } from './taxHistory';
import { virtualTour } from './virtualTour';

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
    propertyType,
    property,
    listing,
    featuredListing,
    virtualTour,
    media,
    feature,
    featureCategory,
    propertyFeature,
    taxHistory,
    priceHistory,
    openHouse,
};

export default schema;
