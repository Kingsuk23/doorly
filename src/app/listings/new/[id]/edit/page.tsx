import ListingPageContent from '@/features/listings/components/listings-page-content';
import WizardStepperSkeleton from '@/features/properties/components/skeleton/wizard-stepper-skeleton';
import { Suspense } from 'react';

const Listing = ({ params }: PageProps<'/listings/new/[id]/edit'>) => {
    return (
        <main className="max-w-7xl mx-auto flex flex-col justify-between md:px-4 px-2">
            <Suspense fallback={<WizardStepperSkeleton />}>
                <ListingPageContent params={params} />
            </Suspense>
        </main>
    );
};

export default Listing;
