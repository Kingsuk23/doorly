import FieldRowSkeleton from './field-Row-skeleton';

const FormSkeleton = () => (
    <div className="flex w-full flex-col gap-6">
        <FieldRowSkeleton className="h-10" />
        <FieldRowSkeleton className="h-10" />
        <FieldRowSkeleton />
        <FieldRowSkeleton />
        <FieldRowSkeleton hasHint={false} />
    </div>
);

export default FormSkeleton;
