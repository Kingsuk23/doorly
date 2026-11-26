'use server';

import { db } from '@/db';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { requireSession } from '@/lib/auth/require-session';

export const getListingByAgentUserId = async () => {
    try {
        const session = await requireSession();

        if (session.user.role !== 'agent') {
            throw new AppError(
                'FORBIDDEN',
                'Only agents can perform this action.',
            );
        }

        const foundAgent = await db.query.agent.findFirst({
            where: { userId: session.user.id },
        });

        if (!foundAgent) {
            throw new AppError(
                'NOT_FOUND',
                'Agent profile not found for this account.',
            );
        }

        const listings = await db.query.propertyMember.findMany({
            where: {
                userId: foundAgent.userId,
                role: 'agent',
            },
            with: {
                property: { with: { listing: true } },
            },
        });

        const listingData = listings.map((r) => r.property?.listing);

        return ok(listingData);
    } catch (error) {
        return handleError(error);
    }
};
