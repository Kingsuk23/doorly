'use server';

import { utapi } from '@/lib/uploadthing/server';

export async function deleteUpload(fileKey: string) {
    await utapi.deleteFiles(fileKey);
}
