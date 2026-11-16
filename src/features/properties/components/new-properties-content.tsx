import PropertyWizard from './property-wizard';
import { cratePropertyMember } from '../actions/property-member-actions';
import PropertyWizardHeader from './property-wizard-header';

const NewPropertiesContent = async ({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) => {
    const { id } = await params;
    await cratePropertyMember({ propertyId: id });
    return (
        <div className="mx-auto max-w-5xl px-2 py-8 md:px-4">
            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                <PropertyWizardHeader id={id} />

                <PropertyWizard propertyId={id} />
            </div>
        </div>
    );
};

export default NewPropertiesContent;
