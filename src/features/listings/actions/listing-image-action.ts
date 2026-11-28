'use server';

import { AppError, ok } from '@/lib/api/result';
import { handleError } from '@/lib/api/response';
import { db } from '@/db';
import { media } from '@/db/schemas/media-db-schema';
import { requireSession } from '@/lib/auth/require-session';
import { and, eq } from 'drizzle-orm';
import { listingFormStepId } from '../constants/listing-forms-steps';
import {
    partialListingMediaSchema,
    partialMediaFormInput,
} from '../schemas/zod-listings-schema';

const IMAGEKIT_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;

export const getListingMedia = async ({ listingId }: { listingId: string }) => {
    try {
        const session = await requireSession();

        if (session.user.role !== 'agent') {
            throw new AppError(
                'FORBIDDEN',
                'Only agents can perform this action.',
            );
        }
        if (!listingId) {
            throw new AppError('BAD_REQUEST', 'Listing id not found.');
        }

        const agent = await db.query.agent.findFirst({
            where: { userId: session.user.id },
        });
        if (!agent) {
            throw new AppError(
                'NOT_FOUND',
                'Agent profile not found for this account.',
            );
        }

        const foundListing = await db.query.listing.findFirst({
            where: { id: listingId },
        });
        if (!foundListing) {
            throw new AppError('NOT_FOUND', 'Listing not found.');
        }

        const propertyId = foundListing.propertyId;

        const media = await db.query.media.findMany({
            where: { listingId, propertyId, uploadedBy: agent.id },
        });

        return ok(media);
    } catch (error) {
        return handleError(error);
    }
};

export const createOrUpdateListingMedia = async ({
    listingId,
    stepId,
    body,
}: {
    listingId: string;
    stepId: listingFormStepId;
    body: partialMediaFormInput;
}) => {
    try {
        const session = await requireSession();

        if (session.user.role !== 'agent') {
            throw new AppError(
                'FORBIDDEN',
                'Only agents can perform this action.',
            );
        }
        if (!listingId || !stepId) {
            throw new AppError('BAD_REQUEST', 'Listing id or step not found.');
        }

        const agent = await db.query.agent.findFirst({
            where: { userId: session.user.id },
        });
        if (!agent) {
            throw new AppError(
                'NOT_FOUND',
                'Agent profile not found for this account.',
            );
        }

        const foundListing = await db.query.listing.findFirst({
            where: { id: listingId },
        });
        if (!foundListing) {
            throw new AppError('NOT_FOUND', 'Listing not found.');
        }
        // TODO: also verify this listing belongs to `agent` (use your real owner column)
        const propertyId = foundListing.propertyId;

        const { items = [] } = partialListingMediaSchema.parse(body);

        if (items.filter((i) => i.isPrimary).length > 1) {
            throw new AppError(
                'BAD_REQUEST',
                'Only one cover image is allowed.',
            );
        }
        if (items.some((i) => i.url && !i.url.startsWith(IMAGEKIT_ENDPOINT))) {
            throw new AppError('BAD_REQUEST', 'Invalid media URL.');
        }

        const saved = await db.transaction(async (tx) => {
            await tx
                .update(media)
                .set({ isPrimary: false })
                .where(
                    and(
                        eq(media.propertyId, propertyId),
                        eq(media.isPrimary, true),
                    ),
                );

            const results = [];

            for (const [index, item] of items.entries()) {
                const { id, ...fields } = item;
                const values = {
                    ...fields,
                    sortOrder: index,
                };

                if (id) {
                    const [row] = await tx
                        .update(media)
                        .set(values)
                        .where(
                            and(
                                eq(media.id, id),
                                eq(media.listingId, listingId),
                                eq(media.propertyId, propertyId),
                            ),
                        )
                        .returning();
                    if (row) results.push(row);
                } else {
                    console.log(values);
                    const [row] = await tx
                        .insert(media)
                        .values({
                            ...values,
                            propertyId,
                            listingId,
                            uploadedBy: agent.id,
                        } as typeof media.$inferInsert)
                        .returning();
                    results.push(row);
                }
            }

            return results;
        });

        return ok(saved);
    } catch (error) {
        return handleError(error);
    }
};
