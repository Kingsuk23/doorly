import { Skeleton } from '@/components/ui/skeleton';

export const InviteCardSkeleton = () => {
    return (
        <div className="rounded-lg border p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="rounded-md bg-muted p-3 flex flex-col gap-2">
                <Skeleton className="h-4 w-44 bg-background/60" />
                <Skeleton className="h-3 w-56 bg-background/60" />
                <Skeleton className="h-3 w-48 bg-background/60" />
            </div>

            <div className="border-l-2 pl-3 flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
            </div>

            <Skeleton className="h-3 w-28" />

            <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    );
};
