'use client';

import { toast } from '@/components/ui/toast';
import { deleteProperty } from '@/features/properties/actions/property-actions';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader, MoreHorizontal, Pen, Trash } from 'lucide-react';
import Link from 'next/link';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PropertyDeleteActionSellProps {
    id: string;
    stepId:
        | 'location_c'
        | 'layout_c'
        | 'parking_systems_c'
        | 'ownership_legal_c'
        | 'description_c'
        | 'review_publish_c'
        | null;
}

const PropertyDeleteActionSell = ({
    id,
    stepId,
}: PropertyDeleteActionSellProps) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteProperty(id);
                setOpen(false);
                router.refresh();
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Failed to delete property',
                });
            }
        });
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            render={
                                <Link
                                    href={`properties/new/${id}/edit?step=${stepId}`}
                                />
                            }
                        >
                            <Pen /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setOpen(true)}
                        >
                            <Trash /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this property?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The property will be
                            permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="secondary" />}
                            disabled={isPending}
                        >
                            Close
                        </DialogClose>
                        <Button
                            variant="destructive"
                            disabled={isPending}
                            onClick={handleDelete}
                        >
                            {isPending && <Loader className="animate-spin" />}
                            {isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PropertyDeleteActionSell;
