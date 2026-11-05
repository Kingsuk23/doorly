import { useQuery } from '@tanstack/react-query';
import { fetchAddressSuggestion } from '../api/fetchAddressSuggestions';

export const useAddressComplete = (text: string) => {
    return useQuery({
        queryKey: ['address-autocomplete', text],
        queryFn: ({ signal }) => fetchAddressSuggestion(text, signal),
        enabled: text.trim().length >= 3,
        staleTime: 60_000,
    });
};
