'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import { useImageKitUploads } from '@/features/dropzone/store/image-kit-upload';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const ListingWizardHeader = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDiscard = () => {
        startTransition(async () => {
            try {
                const { clear, fileIds } = useImageKitUploads.getState();

                await Promise.allSettled(
                    fileIds.map((fileId) => deleteImageKitFile(fileId)),
                );
                clear();
                router.push('/agent-profile');
                router.refresh();
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Something went wrong. Please try again.',
                });
            }
        });
    };

    return (
        <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
            <h1 className="text-lg font-semibold">Modify listing</h1>

            <Button
                variant="secondary"
                onClick={handleDiscard}
                disabled={isPending}
            >
                {isPending ? <Loader className="animate-spin" /> : 'Discard'}
            </Button>
        </header>
    );
};

export default ListingWizardHeader;
