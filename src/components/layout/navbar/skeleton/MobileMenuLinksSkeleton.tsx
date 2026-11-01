import { Skeleton } from '@/components/ui/skeleton';

const MobileMenuLinksSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-4 w-full my-6 px-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    className="w-full bg-muted-foreground/10 rounded-md p-4 flex flex-col gap-2"
                    key={index}
                >
                    <Skeleton className="size-6 w-full" />
                    <Skeleton className="w-20 h-4" />
                </div>
            ))}
        </div>
    );
};

export default MobileMenuLinksSkeleton;
