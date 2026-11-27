import { cn } from 'cn';
import { Check } from 'lucide-react';
import { listingFormSteps } from '../constants/listing-forms-steps';

type WizardStepperProps = {
    currentIndex: number;
    onStepClick: (index: number) => void;
};

const ListingWizardStepper = ({
    currentIndex,
    onStepClick,
}: WizardStepperProps) => {
    const current = listingFormSteps[currentIndex];

    return (
        <>
            <div className="md:hidden">
                <p className="text-sm font-medium">{current.title}</p>
                <p className="text-muted-foreground text-xs">
                    Step {currentIndex + 1} of {listingFormSteps.length}
                </p>
                <div className="mt-3 flex h-1 gap-1.5">
                    {listingFormSteps.map((s, i) => (
                        <div
                            key={s.id}
                            className={cn(
                                'h-full flex-1 rounded-full transition-colors duration-300',
                                i <= currentIndex ? 'bg-primary' : 'bg-muted',
                            )}
                        />
                    ))}
                </div>
            </div>

            <nav aria-label="Progress" className="hidden md:block">
                <ol>
                    {listingFormSteps.map((step, i) => {
                        const isDone = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        const isLast = i === listingFormSteps.length - 1;

                        return (
                            <li
                                key={step.id}
                                className="relative flex gap-3 pb-8 last:pb-0"
                            >
                                {!isLast && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute top-8 left-4 -ml-px h-[calc(100%-2rem)] w-0.5 transition-colors duration-300',
                                            isDone ? 'bg-primary' : 'bg-border',
                                        )}
                                    />
                                )}

                                <button
                                    type="button"
                                    disabled={!isDone}
                                    onClick={() => onStepClick(i)}
                                    aria-current={
                                        isCurrent ? 'step' : undefined
                                    }
                                    className="focus-visible:ring-ring flex items-start gap-3 rounded-md text-left outline-none focus-visible:ring-2 disabled:cursor-default"
                                >
                                    <span
                                        className={cn(
                                            'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                                            isDone &&
                                                'border-primary bg-primary text-primary-foreground',
                                            isCurrent &&
                                                'border-primary bg-background text-primary',
                                            !isDone &&
                                                !isCurrent &&
                                                'border-border bg-background text-muted-foreground',
                                        )}
                                    >
                                        {isDone ? (
                                            <Check className="size-4" />
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    <span className="pt-0.5">
                                        <span
                                            className={cn(
                                                'block text-sm font-medium',
                                                !isDone &&
                                                    !isCurrent &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            {step.title}
                                        </span>
                                        <span className="text-muted-foreground block text-xs">
                                            {step.subtitle}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
};

export default ListingWizardStepper;
