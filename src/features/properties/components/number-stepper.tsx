import { Minus, Plus } from 'lucide-react';
import { cn } from 'cn';

type Props = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label: string;
    labelledBy?: string;
    className?: string;
    id?: string;
    'aria-invalid'?: boolean;
};

const NumberStepper = ({
    value,
    onChange,
    min = 0,
    max = 10,
    step = 1,
    label,
    labelledBy,
    className,
    id,
    'aria-invalid': invalid,
}: Props) => {
    const clamp = (n: number) =>
        Math.min(max, Math.max(min, Math.round(n * 100) / 100));

    return (
        <div
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : label}
            aria-invalid={invalid}
            className={cn(
                'border-input flex w-full min-w-0 items-center justify-between rounded-lg border bg-transparent p-1 text-base transition-colors md:text-sm',
                'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-3',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
                className,
            )}
            id={id}
        >
            <button
                type="button"
                aria-label={`Decrease ${label}`}
                disabled={value <= min}
                onClick={() => onChange(clamp(value - step))}
                className="text-muted-foreground hover:text-foreground disabled:text-foreground/50 flex size-8 cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
            >
                <Minus className="size-5" />
            </button>

            <span
                className="text-base text-foreground tabular-nums data-[active=0]:text-muted-foreground"
                aria-live="polite"
                data-active={value}
            >
                {value}
            </span>

            <button
                type="button"
                aria-label={`Increase ${label}`}
                disabled={value >= max}
                onClick={() => onChange(clamp(value + step))}
                className="text-muted-foreground hover:text-foreground disabled:text-foreground/50 flex size-8 cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
            >
                <Plus className="size-5" />
            </button>
        </div>
    );
};

export default NumberStepper;
