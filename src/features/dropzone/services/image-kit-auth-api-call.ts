import { fetchApi } from '@/lib/api/client';
import { imageKitAuthType } from '../types';
import { ApiResponse } from '@/lib/api/result';

export async function getImageKitAuth(
    init?: RequestInit,
): Promise<ApiResponse<imageKitAuthType>> {
    const result = await fetchApi<imageKitAuthType>(
        '/api/image-kit/auth',
        init,
    );

    if (!result.success) {
        throw new Error(result.error.message);
    }

    return result;
}
