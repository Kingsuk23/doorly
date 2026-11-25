export type Stat = { label: string; value: string | number };

export type AgentData = {
    propertyId: string | null;
    userId: string;
    name: string;
    image: string | null;
    status: 'pending' | 'approved' | 'revoked';
};

export type PropertyRow = {
    id: string;
    property_type: string | null;
    status: 'publish' | 'draft' | 'hidden';
    bedrooms: number | null;
    bathrooms: string | null;
    garage: number | null;
    area_size: string | null;
    created_at: Date | null;
    build_year: number | null;
    stepId:
        | 'location_c'
        | 'layout_c'
        | 'parking_systems_c'
        | 'ownership_legal_c'
        | 'description_c'
        | 'review_publish_c'
        | null;
    agents: AgentData[];
};
