import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
}

const InfoRow = ({ icon: Icon, label, value, href }: InfoRowProps) => (
    <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <p className="truncate text-sm font-medium">
                {href ? (
                    <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                    >
                        {value}
                    </Link>
                ) : (
                    value
                )}
            </p>
        </div>
    </div>
);

export default InfoRow;
