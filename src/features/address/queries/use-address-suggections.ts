import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchAddressSuggestion } from '../services/fetchAddressSuggestions';

export const useAddressSuggestions = (text: string) => {
    const [debounce] = useDebounce(text.trim(), 300);

    return useQuery({
        queryKey: ['address-suggestions', debounce],
        queryFn: ({ signal }) => fetchAddressSuggestion(debounce, signal),
        staleTime: 1000 * 6 * 5,
        placeholderData: keepPreviousData,
        retry: false,
    });
};
