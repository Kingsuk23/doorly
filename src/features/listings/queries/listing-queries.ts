import { useQuery } from '@tanstack/react-query';
import { getListingById } from '../actions/listing-action';
import { getListingMedia } from '../actions/listing-image-action';

export const listingKey = {
    getListingById: (id: string) => ['get-listing-by-id', id] as const,
    listingMedia: (listingId: string) =>
        ['get-listing-media', listingId] as const,
};

export const useGetListingById = (id: string) => {
    return useQuery({
        queryKey: listingKey.getListingById(id),
        queryFn: () => getListingById(id),
    });
};

export const useGetListingMedia = (listingId: string) => {
    return useQuery({
        queryKey: listingKey.listingMedia(listingId),
        queryFn: () => getListingMedia({ listingId }),
    });
};
