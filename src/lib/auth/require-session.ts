import { headers } from 'next/headers';
import { auth } from './auth';
import { AppError } from '../api/result';

export const requireSession = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');
    return session;
};
