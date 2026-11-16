export const steps = [
    {
        id: 'location_c',
        title: 'Type & location',
        subtitle: 'Choose the type and address',
        heading: 'Where is the property?',
        description:
            'Start with the basics. We save a draft so you can come back anytime.',
    },
    {
        id: 'layout_c',
        title: 'Size & layout',
        subtitle: 'Rooms, area and year built',
        heading: 'Size and layout',
        description:
            'Tell buyers how big the property is and how it is arranged.',
    },
    {
        id: 'parking_systems_c',
        title: 'Parking & systems',
        subtitle: 'Parking, heating and cooling',
        heading: 'Parking and systems',
        description:
            'Add parking and climate details. All fields are optional.',
    },
    {
        id: 'ownership_legal_c',
        title: 'Ownership & legal',
        subtitle: 'Owner, HOA and zoning',
        heading: 'Ownership and legal details',
        description: 'This information is optional.',
    },
    {
        id: 'description_c',
        title: 'Description',
        subtitle: 'Describe your property',
        heading: 'Describe the property',
        description:
            'Write a short summary that helps buyers picture living here.',
    },
    {
        id: 'review_publish_c',
        title: 'Preview & publish',
        subtitle: 'Confirm details and publish',
        heading: 'Review and publish',
        description:
            'Check everything. You can edit any section before publishing.',
    },
] as const;

export type StepId = (typeof steps)[number]['id'];

export const stepIds = [
    'location_c',
    'layout_c',
    'parking_systems_c',
    'ownership_legal_c',
    'description_c',
] as const;

export type StepIdType = (typeof stepIds)[number];
