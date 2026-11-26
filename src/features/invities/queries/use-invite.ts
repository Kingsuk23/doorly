import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createInvite,
    getMyInvites,
    acceptInvite,
    declineInvite,
} from '../actions/invite-actions';
import { toast } from '@/components/ui/toast';

export const inviteKeys = {
    mine: ['my_invites'] as const,
    propertyAgents: (propertyId: string) =>
        ['property-agents', propertyId] as const,
    agentSearch: (propertyId: string) =>
        ['fetch-all-agents', propertyId] as const,
};

export const useMyInvites = () => {
    return useQuery({
        queryKey: inviteKeys.mine,
        queryFn: getMyInvites,
    });
};

export const usePushInvites = (propertyId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (agentUserId: string) =>
            createInvite({ agentUserId, propertyId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: inviteKeys.agentSearch(propertyId),
            });
            queryClient.invalidateQueries({
                queryKey: inviteKeys.propertyAgents(propertyId),
            });
        },
    });
};

export const useDeclineRequest = (propertyId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => declineInvite({ propertyId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: inviteKeys.mine,
            });
        },
    });
};

export const useAcceptRequest = (propertyId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => acceptInvite({ propertyId }),
        onSuccess: (res) => {
            if (!res.success) {
                toast.add({ type: 'error', description: res.error.message });
                return;
            }
            queryClient.invalidateQueries({
                queryKey: inviteKeys.mine,
            });
        },
    });
};
