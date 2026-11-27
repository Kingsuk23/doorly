import { useQuery } from '@tanstack/react-query';
import { getListingById } from '../actions/listing-action';

export const listingKey = {
    getListingById: (id: string) => ['get-listing-by-id', id] as const,
};

export const useGetListingById = (id: string) => {
    return useQuery({
        queryKey: listingKey.getListingById(id),
        queryFn: () => getListingById(id),
    });
};
