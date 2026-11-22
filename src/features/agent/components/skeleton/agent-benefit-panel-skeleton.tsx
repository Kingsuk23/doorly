import { Skeleton } from '@/components/ui/skeleton';

const BENEFIT_SKELETON_COUNT = 4;

const AgentBenefitsPanelSkeleton = () => {
    return (
        <aside
            className="flex flex-col gap-10 bg-muted px-6 py-8 md:min-h-screen md:px-10 md:py-12 flex-1"
            aria-busy="true"
            aria-label="Loading"
        >
            <div className="flex flex-col gap-6">
                <Skeleton className="h-10.5 w-32 max-md:hidden" />

                <div className="flex max-w-md flex-col gap-3">
                    <Skeleton className="h-8 w-full md:h-10" />
                    <Skeleton className="h-8 w-3/4 md:h-10" />
                </div>
            </div>

            <ul className="flex flex-col gap-4">
                {Array.from({ length: BENEFIT_SKELETON_COUNT }).map((_, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-4 rounded-xl bg-background p-4 shadow-sm"
                    >
                        <Skeleton className="size-10 shrink-0 rounded-lg" />

                        <div className="flex flex-1 flex-col gap-2">
                            <Skeleton className="h-5 w-1/2" />

                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default AgentBenefitsPanelSkeleton;
