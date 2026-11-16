import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';

type FieldProps = {
    label: string;
    htmlFor: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
};

const FieldRow = ({ label, htmlFor, hint, required, children }: FieldProps) => (
    <div className="grid gap-2 md:grid-cols-[2fr_3fr] md:gap-8">
        <div>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            {hint && (
                <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
            )}
        </div>
        <div>{children}</div>
    </div>
);

export default FieldRow;
