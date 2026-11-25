import { Skeleton } from '@/components/ui/skeleton';

export const AgentSearchItemSkeleton = () => {
    return (
        <div className="w-full flex justify-between items-center p-2 rounded-md">
            <div className="flex items-center gap-2">
                {/* avatar (size="lg" is usually 40px) */}
                <Skeleton className="size-10 rounded-full" />

                <div className="flex flex-col items-start gap-1.5">
                    {/* name */}
                    <Skeleton className="h-4 w-32" />
                    {/* email */}
                    <Skeleton className="h-3 w-44" />
                </div>
            </div>

            {/* invite button */}
            <Skeleton className="h-9 w-16 rounded-md" />
        </div>
    );
};
