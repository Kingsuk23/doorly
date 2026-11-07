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
        listings: r.many.listing({
            from: r.agent.id,
            to: r.listing.agentId,
        }),
        uploadedMedia: r.many.media({
            from: r.agent.id,
            to: r.media.uploadedBy,
        }),
        openHouses: r.many.openHouse({
            from: r.agent.id,
            to: r.openHouse.agentId,
        }),
    },
    agency: {
        agents: r.many.agent({
            from: r.agency.id,
            to: r.agent.agencyId,
        }),
        address: r.one.address({
            from: r.agency.addressId,
            to: r.address.id,
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
        }),

        property: r.many.property({
            from: r.address.id,
            to: r.property.addressId,
        }),
    },

    propertyType: {
        properties: r.many.property({
            from: r.propertyType.id,
            to: r.property.propertyTypeId,
        }),
    },

    property: {
        propertyType: r.one.propertyType({
            from: r.property.propertyTypeId,
            to: r.propertyType.id,
            optional: false,
        }),
        address: r.one.address({
            from: r.property.addressId,
            to: r.address.id,
            optional: false,
        }),
        listings: r.many.listing({
            from: r.property.id,
            to: r.listing.propertyId,
        }),
        media: r.many.media({
            from: r.property.id,
            to: r.media.propertyId,
        }),
        features: r.many.feature({
            from: r.property.id.through(r.propertyFeature.propertyId),
            to: r.feature.id.through(r.propertyFeature.featureId),
        }),
        taxHistory: r.many.taxHistory({
            from: r.property.id,
            to: r.taxHistory.propertyId,
        }),
        openHouses: r.many.openHouse({
            from: r.property.id,
            to: r.openHouse.propertyId,
        }),
    },

    listing: {
        property: r.one.property({
            from: r.listing.propertyId,
            to: r.property.id,
            optional: false,
        }),
        agent: r.one.agent({
            from: r.listing.agentId,
            to: r.agent.id,
            optional: false,
        }),
        featuredListings: r.one.featuredListing({
            from: r.listing.id,
            to: r.featuredListing.listingId,
        }),
        virtualTours: r.many.virtualTour({
            from: r.listing.id,
            to: r.virtualTour.listingId,
        }),
        media: r.many.media({
            from: r.listing.id,
            to: r.media.listingId,
        }),

        priceHistory: r.many.priceHistory({
            from: r.listing.id,
            to: r.priceHistory.listingId,
        }),
        openHouses: r.many.openHouse({
            from: r.listing.id,
            to: r.openHouse.listingId,
        }),
    },

    featuredListing: {
        listing: r.one.listing({
            from: r.featuredListing.listingId,
            to: r.listing.id,
        }),
    },

    virtualTour: {
        listing: r.one.listing({
            from: r.virtualTour.listingId,
            to: r.listing.id,
            optional: false,
        }),
    },

    media: {
        property: r.one.property({
            from: r.media.propertyId,
            to: r.property.id,
            optional: false,
        }),
        listing: r.one.listing({
            from: r.media.listingId,
            to: r.listing.id,
        }),
        uploader: r.one.agent({
            from: r.media.uploadedBy,
            to: r.agent.id,
            optional: false,
        }),
    },

    feature: {
        category: r.one.featureCategory({
            from: r.feature.categoryId,
            to: r.featureCategory.id,
            optional: false,
        }),
        properties: r.many.property({
            from: r.feature.id.through(r.propertyFeature.featureId),
            to: r.property.id.through(r.propertyFeature.propertyId),
        }),
    },

    featureCategory: {
        features: r.many.feature({
            from: r.featureCategory.id,
            to: r.feature.categoryId,
        }),
    },

    taxHistory: {
        property: r.one.property({
            from: r.taxHistory.propertyId,
            to: r.property.id,
            optional: false,
        }),
    },

    priceHistory: {
        listing: r.one.listing({
            from: r.priceHistory.listingId,
            to: r.listing.id,
            optional: false,
        }),
        changedByAgent: r.one.agent({
            from: r.priceHistory.changedBy,
            to: r.agent.id,
        }),
    },

    openHouse: {
        property: r.one.property({
            from: r.openHouse.propertyId,
            to: r.property.id,
            optional: false,
        }),
        listing: r.one.listing({
            from: r.openHouse.listingId,
            to: r.listing.id,
        }),
        agent: r.one.agent({
            from: r.openHouse.agentId,
            to: r.agent.id,
        }),
    },
}));
