import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const ReviewSectionCard = ({
    title,
    onEdit,
    children,
}: {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}) => (
    <section className="rounded-xl border">
        <header className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">{title}</h3>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                aria-label={`Edit ${title}`}
            >
                <Pencil className="size-3.5" /> Edit
            </Button>
        </header>
        <dl className="divide-y px-4">{children}</dl>
    </section>
);

export default ReviewSectionCard;
