import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ReviewAndPublishSkeleton from '@/components/shared/skeleton/review-and-publish-skeleton';
import { useGetListingById } from '../queries/listing-queries';
import { listingFormStepId } from '../constants/listing-forms-steps';
import ReviewSectionCard from '@/components/shared/review-section-card';
import ReviewRow from '@/components/shared/review-row';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import { format } from 'date-fns';

interface ListingReviewAndPublishProps {
    formId: string;
    listingId: string;
    onEdit: (stepId: listingFormStepId) => void;
    onPublished: () => void;
}

const ListingReviewAndPublish = ({
    formId,
    onEdit,
    onPublished,
    listingId,
}: ListingReviewAndPublishProps) => {
    const { data, isPending } = useGetListingById(listingId);
    const [confirmed, setConfirmed] = useState(false);
    const [showError, setShowError] = useState(false);

    const listing = data?.success ? data.data : null;
    const errorMessage = data && !data.success ? data.error.message : null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmed) {
            setShowError(true);
            return;
        }
        onPublished();
    };

    if (isPending) return <ReviewAndPublishSkeleton />;

    if (errorMessage) {
        return (
            <div className="rounded-md border p-4 text-sm text-destructive">
                {errorMessage}
            </div>
        );
    }

    return (
        <form
            id={formId}
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-5"
        >
            <ReviewSectionCard title="Basic" onEdit={() => onEdit('basic_c')}>
                <ReviewRow label="Title" value={listing?.title} />
                <ReviewRow
                    label="Listing type"
                    value={
                        listing?.listing_type &&
                        capitalizeFirstLetter(listing.listing_type)
                    }
                />
                <ReviewRow label="MLS number" value={listing?.mls_number} />
                <ReviewRow label="Description" value={listing?.description} />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Pricing"
                onEdit={() => onEdit('pricing_c')}
            >
                <ReviewRow label="Price" value={listing?.price} />
                <ReviewRow label="Currency" value={listing?.currency} />
                <ReviewRow
                    label="Price per sqft"
                    value={listing?.price_per_sqft}
                />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Schedule"
                onEdit={() => onEdit('schedule_c')}
            >
                <ReviewRow
                    label="Listed at"
                    value={
                        listing?.listed_at &&
                        format(new Date(listing.listed_at), 'PPP')
                    }
                />
                <ReviewRow
                    label="Expire at"
                    value={
                        listing?.expires_at &&
                        format(new Date(listing.expires_at), 'PPP')
                    }
                />
            </ReviewSectionCard>

            <div className="flex items-start gap-3 rounded-xl border p-4">
                <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(v) => {
                        setConfirmed(v === true);
                        setShowError(false);
                    }}
                    aria-invalid={showError}
                />
                <div className="grid gap-1">
                    <Label htmlFor="confirm" className="leading-snug">
                        I confirm the information is accurate and I am allowed
                        to list this property.
                    </Label>
                    {showError && (
                        <p className="text-destructive text-xs">
                            Please confirm before publishing.
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default ListingReviewAndPublish;
