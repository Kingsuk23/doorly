import FieldRowSkeleton from './FieldRowSkeleton';

const TypeAndLocationFormSkeleton = () => (
    <div className="flex w-full flex-col gap-6">
        <FieldRowSkeleton className="h-11" />
        <FieldRowSkeleton className="h-11" />
        <FieldRowSkeleton />
        <FieldRowSkeleton />
        <FieldRowSkeleton hasHint={false} />
    </div>
);

export default TypeAndLocationFormSkeleton;
