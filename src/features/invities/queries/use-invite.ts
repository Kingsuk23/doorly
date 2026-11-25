import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInvite, getMyInvites } from '../actions/invite-actions';

export const useMyInvites = () => {
    useQuery({
        queryKey: ['my_invites'],
        queryFn: getMyInvites,
    });
};

export const usePushInvites = (propertyId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (agentId: string) => createInvite({ agentId, propertyId }),
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
