'use server';

import { db } from '@/db';
import { listing } from '@/db/schemas/listing-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { requireSession } from '@/lib/auth/require-session';
import { and, eq } from 'drizzle-orm';
import {
    partialListingFormInput,
    partialListingFormSchema,
} from '../schemas/zod-listings-schema';
import { listingStepProgress } from '@/db/schemas/listing-step-progress-db-schema';
import { listingFormStepId } from '../constants/listing-forms-steps';

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
                property: {
                    with: { listing: { with: { listingStepProgress: true } } },
                },
            },
        });

        const listingData = listings.flatMap((r) => r.property?.listing ?? []);

        return ok(listingData);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteListingById = async (id: string) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Listing id not found');

        const session = await requireSession();

        const agentId = await db.query.agent.findFirst({
            where: { userId: session.user.id },
        });

        if (!agentId)
            throw new AppError(
                'UNAUTHORIZED',
                'Your not allowed to perform this action',
            );

        const [deleteListing] = await db
            .delete(listing)
            .where(and(eq(listing.agentId, agentId.id), eq(listing.id, id)))
            .returning({ id: listing.id });

        return ok(deleteListing);
    } catch (error) {
        return handleError(error);
    }
};

export const getListingById = async (id: string) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Listing id not found');

        const foundListing = await db.query.listing.findFirst({
            where: { id },
            with: {
                property: {
                    columns: { livingAreaSqft: true, lotSizeSqft: true },
                },
            },
        });

        return ok(foundListing);
    } catch (error) {
        return handleError(error);
    }
};

export const updateListing = async ({
    listingId,
    stepId,
    body,
}: {
    body: partialListingFormInput;
    listingId: string;
    stepId: listingFormStepId;
}) => {
    try {
        if (!listingId || !stepId)
            throw new AppError('BAD_REQUEST', 'Listing id or step not found');

        const { price, price_per_sqft, ...rest } =
            partialListingFormSchema.parse(body);

        const update = await db.transaction(async (tx) => {
            const [updataListing] = await tx
                .update(listing)
                .set({
                    ...rest,
                    ...(price !== undefined && { price: String(price) }),
                    ...(price_per_sqft !== undefined && {
                        price_per_sqft: String(price_per_sqft),
                    }),
                })
                .where(eq(listing.id, listingId))
                .returning({ id: listing.id });

            await tx
                .update(listingStepProgress)
                .set({ stepId })
                .where(eq(listingStepProgress.listingId, listingId));

            return updataListing;
        });

        return ok(update);
    } catch (error) {
        return handleError(error);
    }
};
