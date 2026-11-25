import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllAgents } from '../actions/agent-actions';

export const useGetAllAgent = (query: string, propertyId: string) => {
    return useQuery({
        queryKey: ['fetch-all-agents', propertyId, query],
        queryFn: () => getAllAgents(query, propertyId),
        staleTime: 1000 * 6 * 5,
        placeholderData: keepPreviousData,
    });
};
