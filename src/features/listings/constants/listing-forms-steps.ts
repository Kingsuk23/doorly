export const listingFormSteps = [
    {
        id: 'basic_c',
        title: 'Listing basics',
        subtitle: 'Type, title and description',
        heading: 'What are you listing?',
        description:
            'Choose whether this is for sale or rent, then add a title and description. We save a draft so you can come back anytime.',
    },
    {
        id: 'pricing_c',
        title: 'Pricing',
        subtitle: 'Price and currency',
        heading: 'Set your price',
        description:
            'Enter the asking price and currency. Price per square foot is optional.',
    },
    {
        id: 'schedule_c',
        title: 'Schedule',
        subtitle: 'Listing and expiry dates',
        heading: 'When should it be live?',
        description:
            'Choose when the listing goes live and when it expires. Both dates are optional.',
    },

    {
        id: 'media_c',
        title: 'Media',
        subtitle: 'Photos and videos',
        heading: 'Show off the property',
        description:
            'Upload photos, videos, or floor plans. Add a title and room for each file, and choose one as the cover image.',
    },
    {
        id: 'review_publish_c',
        title: 'Review & Publish',
        subtitle: 'review & publish',
        heading: 'Review and publish',
        description:
            'Check that everything is correct. You can edit any section before publishing, or save the listing as a draft and finish later.',
    },
] as const;

export type listingFormStepId = (typeof listingFormSteps)[number]['id'];
