interface OptionType {
    label: string;
    value: string | number;
}

const PROPERTY_TYPES = [
    { label: 'House', value: 'house' },
    { label: 'Condo', value: 'condo' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Multi-family', value: 'multi-family' },
    { label: 'Land', value: 'land' },
    { label: 'Commercial', value: 'commercial' },
] as const satisfies readonly OptionType[];

export const PROPERTY_TYPE_FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    ...PROPERTY_TYPES,
] as const;
