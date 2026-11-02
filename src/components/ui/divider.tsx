import { cn } from 'cn';

interface DividerProps {
    className?: string;
}

const Divider: React.FC<DividerProps> = ({ className }) => (
    <div
        aria-hidden="true"
        className={cn('w-px self-stretch bg-border', className)}
    />
);

export default Divider;
