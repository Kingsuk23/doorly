export type ErrorCode =
    | 'BAD_REQUEST'
    | 'VALIDATION_ERROR'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'UPSTREAM_ERROR'
    | 'INTERNAL_ERROR';

export type ApiSuccess<T> = { success: true; data: T };

export type ApiFailure = {
    success: false;
    error: { code: ErrorCode; message: string; details?: unknown };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
export type ActionResult<T> = ApiResponse<T>;

export class AppError extends Error {
    constructor(
        public code: ErrorCode,
        message: string,
        public details?: unknown,
    ) {
        super(message);
    }
}

export const ok = <T>(data: T): ApiSuccess<T> => ({ success: true, data });

export const fail = (
    code: ErrorCode,
    message: string,
    details?: unknown,
): ApiFailure => ({
    success: false,
    error: { code, message, details },
});
