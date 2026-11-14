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

interface DropzoneProps {
    label: string;
    className?: string;
    folder?: string;
    fileId?: string;
    onUploaded?: (media: UploadedMedia) => void;
}

const Dropzone = ({
    className,
    folder = '/doorly',
    onUploaded,
    label,
    fileId,
}: DropzoneProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    const handleDrop = useCallback(
        async (accepted: File[]) => {
            const file = accepted[0];
            if (!file) return;

            setIsUploading(true);

            abortRef.current = new AbortController();
            try {
                if (fileId) {
                    await deleteImageKitFile(fileId);
                }

                const auth = await getImageKitAuth();
                if (!auth.success) {
                    toast.add({
                        type: 'error',
                        description: auth.error.message,
                    });
                    return;
                }

                const result = await handleImageKitUpload({
                    file,
                    folder,
                    imageKitAuth: auth.data,
                    abort: abortRef.current,
                });
                if (!result.success) {
                    if (result.error.message !== 'Upload cancelled') {
                        toast.add({
                            type: 'error',
                            description: result.error.message,
                        });
                    }
                    return;
                }

                onUploaded?.(result.data);
            } finally {
                setIsUploading(false);
            }
        },
        [fileId, folder, onUploaded],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: handleDrop,
        multiple: false,
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
                    <span>
                        {isDragActive
                            ? 'Drop the logo here'
                            : 'Drag a logo here or'}
                    </span>
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
