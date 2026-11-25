import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getPropertyAgents,
    removePropertyAgent,
} from '../actions/property-member-actions';

export const useGetAssignPropertiesAgents = (propertyId: string) => {
    return useQuery({
        queryKey: ['property-agents', propertyId],
        queryFn: () => getPropertyAgents(propertyId),
    });
};

export const useRemoveAgent = (propertyId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            memberId,
            agentUserId,
        }: {
            memberId: string;
            agentUserId: string;
        }) => removePropertyAgent(agentUserId, memberId, propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['fetch-all-agents', propertyId],
            });
            queryClient.invalidateQueries({
                queryKey: ['property-agents', propertyId],
            });
        },
    });
};
