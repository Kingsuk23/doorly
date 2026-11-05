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

export const SALE_PRICE_FILTER_OPTIONS = [
    { label: 'Any price', value: 'all' },
    ...SALE_PRICE_RANGES,
] as const;

export function getPriceRange(
    value: string | null | undefined,
    ranges: readonly PriceRange[],
): { min: number | null; max: number | null } {
    const found = ranges.find((r) => r.value === value);
    return { min: found?.min ?? null, max: found?.max ?? null };
}
