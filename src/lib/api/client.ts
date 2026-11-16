import { fail, type ApiResponse } from '@/lib/api/result';

export async function fetchApi<T>(
    url: string,
    init?: RequestInit,
): Promise<ApiResponse<T>> {
    let res: Response;

    try {
        res = await fetch(url, init);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        console.error('[fetchApi] network error:', url, error);
        return fail('INTERNAL_ERROR', 'Network error. Check your connection.');
    }

    try {
        return (await res.json()) as ApiResponse<T>;
    } catch {
        console.error('[fetchApi] invalid response:', url, res.status);
        return fail(
            res.status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST',
            'Unexpected response from the server',
        );
    }
}
