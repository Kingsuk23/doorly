import { useQuery } from '@tanstack/react-query';
import { getMyInvites } from '../actions/invite-actions';

export const useMyInvites = () => {
    useQuery({
        queryKey: ['my_invites'],
        queryFn: getMyInvites,
    });
};
