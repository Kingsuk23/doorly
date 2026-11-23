import { Skeleton } from '@/components/ui/skeleton';

const AgentProfileCardSkeleton = () => {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <Skeleton className="h-20" />

            <div className="px-6 pb-6">
                <div className="-mt-5 flex items-end justify-between gap-4">
                    <Skeleton className="size-13 rounded-full" />
                    <div className="flex gap-2 items-center">
                        <Skeleton className="h-7 w-48" />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-22" />
                </div>

                <Skeleton className="h-4 w-80 mt-2" />

                <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div className="flex items-center gap-3" key={index}>
                            <Skeleton className="flex size-9 shrink-0 rounded-lg" />
                            <div className="min-w-0">
                                <Skeleton className="h-3 w-18" />
                                <Skeleton className="h-3.5 w-32 mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentProfileCardSkeleton;
