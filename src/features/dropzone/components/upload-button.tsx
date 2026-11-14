import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { handleImageKitUpload, UploadedMedia } from '@/lib/imge-kit-upload';
import { getImageKitAuth } from '../services/image-kit-auth-api-call';
import { toast } from '@/components/ui/toast';
import { deleteImageKitFile } from '../services/image-kit-delete-file';

interface UploadButtonProps {
    onUploaded?: (media: UploadedMedia) => void;
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
    fileId?: string;
    folder?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
    onUploaded,
    className,
    fileId,
    variant = 'default',
    size = 'default',
    children,
    folder = '/doorly',
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => () => abortRef.current?.abort(), []);

    const handleChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const file = files[0];
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
            }
            e.target.value = '';
        },
        [fileId, folder, onUploaded],
    );

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
