import { Skeleton } from '@/components/ui/skeleton';
import WizardStepperSkeleton from './wizard-stepper-skeleton';
import TypeAndLocationFormSkeleton from './form-skeleton';

const WizardPageSkeleton = () => (
    <div
        className="mx-auto max-w-5xl px-2 py-8 md:px-4"
        role="status"
        aria-busy="true"
    >
        <span className="sr-only">Loading your property draft</span>

        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
                <Skeleton className="h-6 w-36" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="hidden h-9 w-20 md:block" />
                    <Skeleton className="hidden h-9 w-20 md:block" />
                </div>
            </header>

            <div className="grid gap-8 p-4 md:grid-cols-[240px_1fr] md:gap-12 md:p-8">
                <WizardStepperSkeleton />

                <section>
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="mt-2 h-8 w-64" />
                    <Skeleton className="mt-3 h-4 w-full max-w-md" />

                    <div className="mt-8">
                        <TypeAndLocationFormSkeleton />
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </section>
            </div>
        </div>
    </div>
);

export default WizardPageSkeleton;
