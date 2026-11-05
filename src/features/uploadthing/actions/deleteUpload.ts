'use server';

import { utapi } from '@/lib/uploadthing/server/uploadthing';

export async function deleteUpload(fileKey: string) {
    await utapi.deleteFiles(fileKey);
}
