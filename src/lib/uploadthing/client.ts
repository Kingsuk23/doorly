import type { OurFileRouter } from '@/lib/uploadthing/core';

import { generateReactHelpers } from '@uploadthing/react';

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
