import { useQuery } from '@tanstack/react-query';
import { getProperty } from '../actions/property-actions';

export const useGetPropertyById = (id: string) => {
    return useQuery({
        queryKey: ['get_property_by_member', id],
        queryFn: () => getProperty(id),
        enabled: !!id,
    });
};
