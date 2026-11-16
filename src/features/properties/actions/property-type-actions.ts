'use server';

import { db } from '@/db';
import { propertyType } from '@/db/schemas/property-type-db-schema';
import { handleError } from '@/lib/api/response';
import { ok } from '@/lib/api/result';

export const getPropertyType = async () => {
    try {
        const foundPropertyType = await db
            .select({ id: propertyType.id, name: propertyType.name })
            .from(propertyType);

        return ok(foundPropertyType);
    } catch (error) {
        return handleError(error);
    }
};
