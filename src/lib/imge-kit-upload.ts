import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from '@imagekit/next';

import { imageKitAuthType } from '@/features/dropzone/types';
import { ApiResponse, fail, ok } from './api/result';

export type UploadedMedia = {
    url: string;
    fileId: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    size: number;
    fileType?: string;
};

type imageKitUploadParams = {
    file: File;
    imageKitAuth: imageKitAuthType;
    abort: AbortController;

    folder?: string;
};

export const handleImageKitUpload = async ({
    file,
    imageKitAuth,
    abort,

    folder = '/doorly',
}: imageKitUploadParams): Promise<ApiResponse<UploadedMedia>> => {
    const { signature, expire, token, publicKey } = imageKitAuth;

    try {
        const res = await upload({
            expire,
            token,
            signature,
            publicKey,
            file,
            folder,
            fileName: file.name,
            abortSignal: abort.signal,
        });

        if (!res.url || !res.fileId) {
            return fail('UPSTREAM_ERROR', 'Upload finished without a file URL');
        }

        return ok({
            url: res.url,
            fileId: res.fileId,
            thumbnailUrl: res.thumbnailUrl ?? res.url,
            width: res.width ?? 0,
            height: res.height ?? 0,
            size: res.size ?? file.size,
        });
    } catch (error) {
        if (error instanceof ImageKitAbortError) {
            return fail('BAD_REQUEST', 'Upload cancelled');
        }
        if (error instanceof ImageKitInvalidRequestError) {
            console.error('[imagekit] invalid request:', error.message);
            return fail('BAD_REQUEST', 'The file could not be uploaded');
        }
        if (error instanceof ImageKitUploadNetworkError) {
            return fail(
                'INTERNAL_ERROR',
                'Network error. Check your connection.',
            );
        }
        if (error instanceof ImageKitServerError) {
            console.error('[imagekit] server error:', error.message);
            return fail(
                'UPSTREAM_ERROR',
                'Image service is unavailable, try again',
            );
        }

        console.error('[imagekit] unknown error:', error);
        return fail('INTERNAL_ERROR', 'Upload failed');
    }
};
