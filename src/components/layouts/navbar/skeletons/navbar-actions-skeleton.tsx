import { Skeleton } from '@/components/ui/skeleton';

const NavbarActionsSkeleton = () => (
    <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="size-9 rounded-full" />
    </div>
);

export default NavbarActionsSkeleton;
