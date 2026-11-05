export type GeoapifyResultType =
    | 'unknown'
    | 'amenity'
    | 'building'
    | 'street'
    | 'suburb'
    | 'district'
    | 'postcode'
    | 'city'
    | 'county'
    | 'state'
    | 'country';

export interface GeoapifyDatasource {
    sourcename: string;
    attribution: string;
    license: string;
    url: string;
}

export interface GeoapifyBbox {
    lon1: number;
    lat1: number;
    lon2: number;
    lat2: number;
}

export interface GeoapifyRank {
    importance?: number;
    popularity?: number;
    confidence: number;
    confidence_city_level?: number;
    confidence_street_level?: number;
    confidence_building_level?: number;
    match_type: string;
}

export interface GeoapifyTimezone {
    name: string;
    name_alt?: string;
    offset_STD: string;
    offset_DST: string;
    offset_STD_seconds: number;
    offset_DST_seconds: number;
    abbreviation_STD?: string;
    abbreviation_DST?: string;
}

export interface GeoapifyPlace {
    place_id: string;
    formatted: string;
    address_line1: string;
    address_line2: string;
    lat: number;
    lon: number;
    country: string;
    country_code: string;
    category: string;
    result_type: GeoapifyResultType;
    datasource: GeoapifyDatasource;
    rank: GeoapifyRank;
    timezone: GeoapifyTimezone;
    bbox: GeoapifyBbox;
    iso3166_2: string;
    plus_code: string;
    name: string;

    city?: string;
    state?: string;
    state_code?: string;
    state_district?: string;
    county?: string;
    county_code?: string;
    county_district?: string;
    district?: string;
    suburb?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
    iso3166_2_sublevel?: string;
    other_names?: Record<string, string>;
    distance?: number;
}

export interface GeoapifyAutocompleteJSON {
    results: GeoapifyPlace[];
    query?: { text: string; parsed?: Record<string, string> };
}

export interface GeoapifyFormattedAutocompleteJSON {
    placeId: string;
    formatted: string;
    street: string;
    city: string | undefined;
    state: string | undefined;
    stateCode: string | undefined;
    postcode: string | undefined;
    country: string;
    countryCode: string;
    lat: number;
    lon: number;
    resultType: GeoapifyResultType;
}
