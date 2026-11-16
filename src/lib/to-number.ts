export const toNumber = (value: unknown): number | undefined => {
    if (value == null || value === '') return undefined;
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : undefined;
};
