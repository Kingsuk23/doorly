const ReviewRow = ({
    label,
    value,
}: {
    label: string;
    value?: React.ReactNode;
}) => (
    <div className="grid grid-cols-[1fr_1.4fr] gap-4 py-2.5 text-sm">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className={value ? 'font-medium' : 'text-muted-foreground'}>
            {value || '—'}
        </dd>
    </div>
);

export default ReviewRow;
