import { useUploadThing } from '@/lib/uploadthing/client';
import { useDropzone } from 'react-dropzone';
import { cn } from 'cn';
import { Loader2, Upload } from 'lucide-react';
import { useCallback } from 'react';
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from 'uploadthing/client';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { getFileKey } from '@/lib/uploadthing/utils';
import { deleteUpload } from './actions/deleteUpload';

interface DropzoneProps {
    onUpload: (url: string) => void;
    perviousUrl?: string;
    className?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
    onUpload,
    className,
    perviousUrl,
}) => {
    const { isUploading, routeConfig, startUpload } = useUploadThing(
        'imageUploader',
        {
            onClientUploadComplete: async (res) => {
                const file = res?.[0];

                if (file) onUpload(file.ufsUrl ?? file.url);

                if (perviousUrl) {
                    const key = getFileKey(perviousUrl);
                    await deleteUpload(key);
                }

                toast.success('Files uploaded');
            },
            onUploadError: (error) => {
                toast.error(error.message);
            },
        },
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length) {
                startUpload(acceptedFiles);
            }
        },
        [startUpload],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes,
        ),
        multiple: false,
        noClick: true,
        disabled: isUploading,
    });
    return (
        <div
            {...getRootProps()}
            className={cn(
                'flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-xs text-muted-foreground transition-colors',
                isDragActive && 'border-primary bg-primary/5',
                isUploading && 'opacity-60',
                className,
            )}
        >
            <input {...getInputProps()} accept=".png, .jpg" />

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
