import { Skeleton } from '@/components/ui/skeleton';

const SECTIONS = [{ rows: 7 }, { rows: 5 }, { rows: 4 }, { rows: 3 }];

const SectionSkeleton = ({ rows }: { rows: number }) => (
    <div className="rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <div className="divide-y">
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-4 py-3"
                >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                </div>
            ))}
        </div>
    </div>
);

const ReviewAndPublishSkeleton = () => (
    <div
        className="flex flex-col gap-5"
        aria-busy="true"
        aria-label="Loading review"
    >
        {SECTIONS.map((s, i) => (
            <SectionSkeleton key={i} rows={s.rows} />
        ))}

        <div className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <div className="space-y-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border p-4">
            <Skeleton className="size-4 rounded-sm" />
            <div className="w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    </div>
);

export default ReviewAndPublishSkeleton;
