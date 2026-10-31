const OrDivider = ({ label = 'or' }: { label?: string }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="h-px flex-1 bg-border" />
        </div>
    );
};

export default OrDivider;
