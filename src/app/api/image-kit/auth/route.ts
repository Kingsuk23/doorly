import { getUploadAuthParams } from '@imagekit/next/server';

import { handleError, respond } from '@/lib/api/response';
import { auth } from '@/lib/auth/auth';
import { AppError, ok } from '@/lib/api/result';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');

        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        if (!privateKey || !publicKey) {
            throw new AppError(
                'INTERNAL_ERROR',
                'Image upload is not configured',
            );
        }

        const { token, expire, signature } = getUploadAuthParams({
            privateKey,
            publicKey,
        });

        return respond(ok({ token, expire, signature, publicKey }));
    } catch (error) {
        return respond(handleError(error));
    }
}
