import NewPropertiesContent from '@/features/properties/components/new-properties-content';
import WizardStepperSkeleton from '@/features/properties/components/skeleton/wizard-stepper-skeleton';
import { Suspense } from 'react';

const NewProperties = ({ params }: PageProps<'/properties/new/[id]/edit'>) => {
    return (
        <main className="max-w-7xl mx-auto flex flex-col justify-between md:px-4 px-2">
            <Suspense fallback={<WizardStepperSkeleton />}>
                <NewPropertiesContent params={params} />
            </Suspense>
        </main>
    );
};

export default NewProperties;
