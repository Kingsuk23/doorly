import ListingWizard from './listing-wizard';
import ListingWizardHeader from './listing-wizard-header';

const ListingPageContent = async ({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) => {
    const { id } = await params;
    return (
        <div className="mx-auto max-w-5xl px-2 py-8 md:px-4">
            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                <ListingWizardHeader id={id} />

                <ListingWizard listingId={id} />
            </div>
        </div>
    );
};

export default ListingPageContent;
