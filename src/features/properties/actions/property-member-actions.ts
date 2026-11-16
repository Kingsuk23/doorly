'use server';

import { db } from '@/db';
import { propertyMember } from '@/db/schemas/property-member-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export const cratePropertyMember = async ({
    propertyId,
}: {
    propertyId: string;
}) => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');

        const [createdPropertyMember] = await db
            .insert(propertyMember)
            .values({
                userId: session.user.id,
                propertyId,
            })
            .onConflictDoNothing()
            .returning();

        if (!createdPropertyMember) {
            throw new AppError(
                'INTERNAL_ERROR',
                'Failed to add you to this property',
            );
        }

        return ok(createdPropertyMember);
    } catch (error) {
        return handleError(error);
    }
};
