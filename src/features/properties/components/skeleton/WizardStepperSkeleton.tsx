import { Skeleton } from '@/components/ui/skeleton';
import { steps } from '../../constants/steps';

const WizardStepperSkeleton = () => (
    <>
        <div className="md:hidden">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
            <div className="mt-3 flex h-1 gap-1.5">
                {steps.map((s) => (
                    <Skeleton
                        key={s.id}
                        className="h-full flex-1 rounded-full"
                    />
                ))}
            </div>
        </div>

        <ol className="hidden md:block">
            {steps.map((s) => (
                <li key={s.id} className="flex gap-3 pb-8 last:pb-0">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="pt-0.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-1.5 h-3 w-36" />
                    </div>
                </li>
            ))}
        </ol>
    </>
);

export default WizardStepperSkeleton;
