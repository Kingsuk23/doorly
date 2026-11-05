import { GeoapifyFormattedAutocompleteJSON } from '../types';

export const fetchAddressSuggestion = async (
    text: string,
    signal?: AbortSignal,
): Promise<{ result: GeoapifyFormattedAutocompleteJSON[] }> => {
    const res = await fetch(
        `/api/address/autocomplete?text=${encodeURIComponent(text)}`,
        {
            signal,
        },
    );

    if (!res.ok) {
        throw new Error('Failed to suggests address');
    }

    const result = await res.json();
    console.log(result);
    return result;
};
