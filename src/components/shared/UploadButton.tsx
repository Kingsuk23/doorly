import { useUploadThing } from '@/lib/uploadthing';

import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '../ui/button';
import { toast } from 'sonner';
import { getFileKey } from '@/lib/uploadThingUtils';
import { deleteUpload } from '@/features/agency/actions/deleteUpload';

interface UploadButtonProps {
    onUpload: (url: string) => void;
    className?: string;
    variant?:
        | 'default'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'destructive'
        | 'link';
    size?:
        | 'default'
        | 'xs'
        | 'sm'
        | 'lg'
        | 'icon'
        | 'icon-xs'
        | 'icon-sm'
        | 'icon-lg';
    children: React.ReactNode;
    perviousUrl?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
    onUpload,
    className,
    perviousUrl,
    variant = 'default',
    size = 'default',
    children,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { isUploading, startUpload } = useUploadThing('imageUploader', {
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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            startUpload(Array.from(files));
        }
        e.target.value = '';
    };

    return (
        <>
            <input
                type="file"
                accept=".png, .jpg"
                className="hidden"
                ref={inputRef}
                onChange={handleChange}
            />

            <Button
                type="button"
                variant={variant}
                size={size}
                className={className}
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
            >
                {isUploading && <Loader2 size={16} className="animate-spin" />}
                {isUploading ? 'Uploading...' : children}
            </Button>
        </>
    );
};

export default UploadButton;
