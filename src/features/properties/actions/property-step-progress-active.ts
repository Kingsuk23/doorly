'use server';

import { db } from '@/db';
import { propertyStepProgress } from '@/db/schemas/property-step-progress-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { StepIdType } from '../constants/steps';

export const markStepComplete = async (id: string, stepId: StepIdType) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Property id is required');

        const [stepProgressRow] = await db
            .insert(propertyStepProgress)
            .values({ propertyId: id, stepId })
            .onConflictDoUpdate({
                target: [
                    propertyStepProgress.propertyId,
                    propertyStepProgress.stepId,
                ],
                set: { completedAt: new Date() },
            })
            .returning();

        return ok(stepProgressRow);
    } catch (error) {
        return handleError(error);
    }
};
