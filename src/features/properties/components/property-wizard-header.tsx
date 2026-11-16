'use client';

import { Button } from '@/components/ui/button';
import { deleteProperty } from '../actions/property-actions';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

const PropertyWizardHeader = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleDiscard = async () => {
        const res = await deleteProperty(id);

        if (!res.success) {
            toast.add({
                type: 'error',
                description: res.error.message,
            });

            return;
        }

        router.push('/profile');
        router.refresh();
    };

    return (
        <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
            <h1 className="text-lg font-semibold">Add a property</h1>

            <Button variant="secondary" onClick={handleDiscard}>
                Discard
            </Button>
        </header>
    );
};

export default PropertyWizardHeader;
