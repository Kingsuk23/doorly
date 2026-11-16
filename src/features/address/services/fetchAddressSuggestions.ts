import { ApiSuccess } from '@/lib/api/result';
import { GeoapifyFormattedAutocompleteJSON } from '../types';
import { fetchApi } from '@/lib/api/client';

export const fetchAddressSuggestion = async (
    text: string,
    signal?: AbortSignal,
): Promise<ApiSuccess<GeoapifyFormattedAutocompleteJSON[]>> => {
    const res = await fetchApi<GeoapifyFormattedAutocompleteJSON[]>(
        `/api/address/auto-complete?text=${encodeURIComponent(text)}`,
        {
            signal,
        },
    );

    if (!res.success) {
        throw new Error(res.error.message);
    }

    return res;
};
