import { Skeleton } from '@/components/ui/skeleton';

const AgentApplyFormSkeleton = () => {
    return (
        <div className="w-full max-w-sm">
            <Skeleton className="inline-block md:hidden h-10.5 w-10.5 rounded-md" />
            <Skeleton className="mb-6 mt-10 h-7 w-full" />

            <div className="mt-2 flex flex-col gap-4">
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
            </div>
        </div>
    );
};

export default AgentApplyFormSkeleton;
