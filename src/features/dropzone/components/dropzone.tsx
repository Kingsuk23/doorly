'use client';

import { cn } from 'cn';
import { Loader2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../../../components/ui/button';
import { getImageKitAuth } from '@/features/dropzone/services/image-kit-auth-api-call';
import { useCallback, useEffect, useRef, useState } from 'react';
import { handleImageKitUpload, UploadedMedia } from '@/lib/imge-kit-upload';
import { toast } from '@/components/ui/toast';
import { deleteImageKitFile } from '../services/image-kit-delete-file';
import { useImageKitUploads } from '../store/image-kit-upload';
import { fa } from '@faker-js/faker';

interface DropzoneProps {
    label: string;
    className?: string;
    folder?: string;
    fileId?: string;
    multiple?: boolean;
    accept?: Record<string, string[]>;
    hint?: string;
    onUploaded?: (media: UploadedMedia, file: File) => void;
}

const Dropzone = ({
    className,
    folder = '/doorly',
    onUploaded,
    label,
    fileId,
    multiple = false,
    accept,
    hint = 'Drag a file here or',
}: DropzoneProps) => {
    const setUploadState = useImageKitUploads((s) => s.setUploadState);
    const addFileId = useImageKitUploads((s) => s.add);

    const [uploading, setUploading] = useState(0);
    const abortRef = useRef<AbortController | null>(null);

    const isUploading = uploading > 0;

    useEffect(
        () => () => {
            abortRef.current?.abort();
            setUploadState(false);
        },
        [setUploadState],
    );

    const uploadOne = useCallback(
        async (file: File) => {
            const auth = await getImageKitAuth();
            if (!auth.success) {
                toast.add({ type: 'error', description: auth.error.message });
                return;
            }
            const result = await handleImageKitUpload({
                file,
                folder,
                imageKitAuth: auth.data,
                abort: abortRef.current!,
            });

            if (!result.success) {
                if (result.error.message !== 'Upload cancelled') {
                    toast.add({
                        type: 'error',
                        description: `${file.name}: ${result.error.message}`,
                    });
                }
                return;
            }

            addFileId(result.data.fileId);
            onUploaded?.(result.data, file);
        },
        [addFileId, folder, onUploaded],
    );

    const handleDrop = useCallback(
        async (accepted: File[]) => {
            if (!accepted.length) return;

            abortRef.current = new AbortController();

            setUploading(accepted.length);
            setUploadState(true);
            try {
                if (!multiple && fileId) await deleteImageKitFile(fileId);

                const queue = [...accepted];
                const worker = async () => {
                    while (queue.length) {
                        const file = queue.shift()!;
                        try {
                            await uploadOne(file);
                        } finally {
                            setUploading((n) => n - 1);
                        }
                    }
                };
                await Promise.all(
                    Array.from({ length: Math.min(3, queue.length) }, worker),
                );
            } finally {
                setUploading(0);
                setUploadState(false);
            }
        },
        [fileId, multiple, setUploadState, uploadOne],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: handleDrop,
        multiple,
        accept,
        noClick: true,
        disabled: isUploading,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-xs text-muted-foreground transition-colors bg-transparent',
                isDragActive && 'border-primary bg-primary/5',
                'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
                isUploading && 'opacity-60',
                className,
            )}
        >
            <input {...getInputProps()} id={label} />

            {isUploading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                </span>
            ) : (
                <>
                    <span>{hint}</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={open}
                    >
                        <Upload className="mr-2 size-4" />
                        Choose file
                    </Button>
                </>
            )}
        </div>
    );
};

export default Dropzone;
