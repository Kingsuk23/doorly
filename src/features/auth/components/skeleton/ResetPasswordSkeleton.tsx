import { Skeleton } from '@/components/ui/skeleton';

const ResetPasswordSkeleton = () => {
    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col p-6">
            <Skeleton className="size-14 rounded-lg" />
            <Skeleton className="mt-2 h-8 w-56" />

            <div className="mt-4 flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-11 w-full" />
            </div>
        </main>
    );
};

export default ResetPasswordSkeleton;
