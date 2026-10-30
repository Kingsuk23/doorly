import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

export const statement = {
    ...defaultStatements,

    listing: ['create', 'update', 'delete', 'publish'],
    media: ['create', 'delete'],
    tax_history: ['create', 'update'],

    agent: ['verify', 'suspend'],
    agency: ['create', 'update', 'delete', 'verify'],
    profile: ['create', 'update', 'delete'],

    favorite: ['create', 'delete'],
    saved_search: ['create', 'update', 'delete'],
    inquiry: ['create', 'reply'],
    review: ['create', 'update', 'delete'],

    open_house: ['create', 'update', 'delete'],
    tour_slot: ['create', 'update', 'delete'],
    tour_booking: ['create', 'update', 'cancel', 'confirm'],

    feature: ['create', 'update', 'delete'],
    property_type: ['create', 'update', 'delete'],
    location: ['create', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    profile: ['create', 'update', 'delete'],

    favorite: ['create', 'delete'],
    saved_search: ['create', 'update', 'delete'],
    inquiry: ['create'],
    review: ['create', 'update', 'delete'],

    tour_booking: ['create', 'cancel'],
});

export const agent = ac.newRole({
    profile: ['create', 'update'],

    listing: ['create', 'update', 'delete', 'publish'],
    media: ['create', 'delete'],
    tax_history: ['create', 'update'],

    inquiry: ['reply'],

    open_house: ['create', 'update', 'delete'],
    tour_slot: ['create', 'update', 'delete'],
    tour_booking: ['update', 'cancel', 'confirm'],

    favorite: ['create', 'delete'],
    saved_search: ['create', 'update', 'delete'],
});

export const admin = ac.newRole({
    ...adminAc.statements,

    listing: ['create', 'update', 'delete', 'publish'],
    media: ['create', 'delete'],

    agent: ['verify', 'suspend'],
    agency: ['create', 'update', 'delete', 'verify'],

    feature: ['create', 'update', 'delete'],
    property_type: ['create', 'update', 'delete'],
    location: ['create', 'update', 'delete'],

    review: ['delete'],
});
