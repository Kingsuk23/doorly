'use server';

import { AppError } from '@/lib/api/result';

export async function deleteImageKitFile(fileId: string) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
        throw new AppError('INTERNAL_ERROR', 'Image service is not configured');
    }

    const res = await fetch(
        `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
            },
        },
    );

    if (res.status === 404) return; // already gone
    if (!res.ok) {
        console.error('[imagekit] delete failed', fileId, res.status);
        throw new AppError('UPSTREAM_ERROR', 'Could not delete the file');
    }
}
