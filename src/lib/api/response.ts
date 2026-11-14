import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiFailure, ApiResponse, AppError, ErrorCode, fail } from './result';

const STATUS: Record<ErrorCode, number> = {
    BAD_REQUEST: 400,
    VALIDATION_ERROR: 422,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UPSTREAM_ERROR: 502,
    INTERNAL_ERROR: 500,
};

export function handleError(error: unknown): ApiFailure {
    if (error instanceof AppError) {
        return fail(error.code, error.message, error.details);
    }
    if (error instanceof ZodError) {
        return fail('VALIDATION_ERROR', 'Invalid input', error.flatten());
    }
    console.error('[unhandled]', error);
    return fail('INTERNAL_ERROR', 'Something went wrong');
}

export function respond<T>(body: ApiResponse<T>) {
    const status = body.success ? 200 : STATUS[body.error.code];
    return NextResponse.json(body, { status });
}
