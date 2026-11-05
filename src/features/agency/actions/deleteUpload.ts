'use server';

import { utapi } from '@/server/uploadthing';

export async function deleteUpload(fileKey: string) {
    await utapi.deleteFiles(fileKey);
}
