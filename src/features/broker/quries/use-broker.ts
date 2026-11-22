import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { GetListedBrokers } from '../actions/broker-actions';

export const useGetAllBroker = () => {
    return useQuery({
        queryKey: ['fetch_all_broker'],
        queryFn: GetListedBrokers,
        staleTime: 5 * 60_000,
        placeholderData: keepPreviousData,
    });
};
