import { searchParams } from '@/lib/search-params';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';

export const useFilter = () => {
    const [filter, setFilter] = useQueryStates(searchParams, {
        history: 'push',
        clearOnDefault: true,
        shallow: false,
        limitUrlUpdates: {
            method: 'throttle',
            timeMs: 1000,
        },
    });

    const clearFilter = useCallback(() => setFilter(null), [setFilter]);

    return { filter, setFilter, clearFilter };
};
