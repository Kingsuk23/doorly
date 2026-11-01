import { Skeleton } from '@/components/ui/skeleton';

const UserMenuSkeleton = () => {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="size-8 rounded-full" />
        </div>
    );
};

export default UserMenuSkeleton;
