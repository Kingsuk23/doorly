import { Skeleton } from '@/components/ui/skeleton';
import { cn } from 'cn';

type Props = {
    hasHint?: boolean;
    className?: string;
};

const FieldRowSkeleton = ({ hasHint = true, className }: Props) => (
    <div className="grid gap-2 md:grid-cols-[2fr_3fr] md:gap-8">
        <div>
            <Skeleton className="h-4 w-28" />
            {hasHint && <Skeleton className="mt-2 h-3.5 w-full max-w-60" />}
        </div>
        <Skeleton className={cn('h-9 w-full', className)} />
    </div>
);

export default FieldRowSkeleton;
