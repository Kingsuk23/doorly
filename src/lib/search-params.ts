import { PROPERTY_TYPE_FILTER_OPTIONS } from '@/constants/propertyTypes';
import {
    createLoader,
    parseAsInteger,
    parseAsStringEnum,
    inferParserType,
    createSerializer,
} from 'nuqs/server';

const PROPERTY_TYPE_VALUES = PROPERTY_TYPE_FILTER_OPTIONS.map((o) => o.value);

export const searchParams = {
    property_type: parseAsStringEnum(PROPERTY_TYPE_VALUES).withDefault('all'),
    min_price: parseAsInteger.withDefault(0),
    mix_price: parseAsInteger.withDefault(1000000),
};

export const loadSearchParams = createLoader(searchParams);
export const serialize = createSerializer(searchParams, {
    clearOnDefault: true,
});

export type SearchFilters = inferParserType<typeof searchParams>;
