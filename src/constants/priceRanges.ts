export interface PriceRange {
    label: string;
    value: string;
    min: number;
    max: number;
}

export const SALE_PRICE_RANGES = [
    { label: 'Under $50K', value: '0-50000', min: 0, max: 50000 },
    { label: '$50K - $100K', value: '50000-100000', min: 50000, max: 100000 },
    {
        label: '$100K - $250K',
        value: '100000-250000',
        min: 100000,
        max: 250000,
    },
    {
        label: '$250K - $500K',
        value: '250000-500000',
        min: 250000,
        max: 500000,
    },
    {
        label: '$500K - $1M',
        value: '500000-1000000',
        min: 500000,
        max: 1000000,
    },
    { label: '$1M+', value: '1000000-0', min: 1000000, max: 0 },
] as const satisfies readonly PriceRange[];

export const RENT_PRICE_RANGES = [
    { label: 'Under $1,000', value: '0-1000', min: 0, max: 1000 },
    { label: '$1,000 - $2,000', value: '1000-2000', min: 1000, max: 2000 },
    { label: '$2,000 - $3,500', value: '2000-3500', min: 2000, max: 3500 },
    { label: '$3,500+', value: '3500-0', min: 3500, max: 0 },
] as const satisfies readonly PriceRange[];

export const SALE_PRICE_FILTER_OPTIONS = [
    { label: 'Any price', value: 'all' },
    ...SALE_PRICE_RANGES,
] as const;

export const RENT_PRICE_FILTER_OPTIONS = [
    { label: 'Any price', value: 'all' },
    ...RENT_PRICE_RANGES,
] as const;

export function getPriceRange(
    value: string | null | undefined,
    ranges: readonly PriceRange[],
): { min: number | null; max: number | null } {
    const found = ranges.find((r) => r.value === value);
    return { min: found?.min ?? null, max: found?.max ?? null };
}
