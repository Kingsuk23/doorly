import { useGetPropertyById } from '../queries/use-property';
import { StepId } from '../constants/steps';
import { AlertCircle } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import ReviewSectionCard from './review-section-card';
import ReviewRow from './review-row';
import { COOLING_OPTIONS, HEATING_OPTIONS } from '../constants/system-options';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ReviewAndPublishSkeleton from './skeleton/review-and-publish-skeleton';

interface ReviewAndPublishProps {
    formId: string;
    propertyId: string;
    onEdit: (stepId: StepId) => void;
    onPublished: () => void;
}

const number = new Intl.NumberFormat('en-IN');
const labelOf = (
    options: readonly { value: string; label: string }[],
    value?: string | null,
) => options.find((o) => o.value === value)?.label;

const ReviewAndPublish = ({
    formId,
    onEdit,
    onPublished,
    propertyId,
}: ReviewAndPublishProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(propertyId);
    const [confirmed, setConfirmed] = useState(false);
    const [showError, setShowError] = useState(false);

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const a = property?.address;
    const missing = [
        !property?.propertyType && 'Property type',
        !a?.streetLine1 && 'Street address',
        property?.property.bedrooms == null && 'Bedrooms',
        property?.property.bathrooms == null && 'Bathrooms',
        property?.property.livingAreaSqft == null && 'Living area',
    ].filter(Boolean) as string[];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (missing.length > 0) return;
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
            {missing.length > 0 && (
                <div
                    role="alert"
                    className="border-destructive/30 bg-destructive/5 text-destructive flex gap-3 rounded-xl border p-4 text-sm"
                >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>
                        Complete these before publishing:{' '}
                        <strong>{missing.join(', ')}</strong>.
                    </p>
                </div>
            )}

            <ReviewSectionCard
                title="Type & location"
                onEdit={() => onEdit('location_c')}
            >
                <ReviewRow
                    label="Property type"
                    value={
                        property?.propertyType &&
                        capitalizeFirstLetter(property.propertyType.name)
                    }
                />
                <ReviewRow label="Street address" value={a?.streetLine1} />
                <ReviewRow label="Unit or apartment" value={a?.streetLine2} />
                <ReviewRow label="City" value={property?.city?.name} />
                <ReviewRow
                    label="PIN / ZIP code"
                    value={property?.postalCode?.code}
                />
                <ReviewRow
                    label="Unit number"
                    value={property?.property?.unitNumber}
                />
                <ReviewRow
                    label="Parcel number"
                    value={property?.property?.parcelNumber}
                />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Size & layout"
                onEdit={() => onEdit('layout_c')}
            >
                <ReviewRow
                    label="Bedrooms"
                    value={property?.property?.bedrooms}
                />
                <ReviewRow
                    label="Bathrooms"
                    value={
                        property?.property?.bathrooms != null
                            ? Number(property?.property?.bathrooms)
                            : null
                    }
                />
                <ReviewRow
                    label="Living area"
                    value={
                        property?.property?.livingAreaSqft != null
                            ? `${number.format(Number(property?.property?.livingAreaSqft))} sq ft`
                            : null
                    }
                />
                <ReviewRow
                    label="Lot size"
                    value={
                        property?.property?.lotSizeSqft != null
                            ? `${number.format(Number(property?.property?.lotSizeSqft))} sq ft`
                            : null
                    }
                />
                <ReviewRow
                    label="Year built"
                    value={property?.property?.yearBuilt}
                />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Parking & systems"
                onEdit={() => onEdit('parking_systems_c')}
            >
                <ReviewRow
                    label="Parking spaces"
                    value={property?.property?.parkingSpaces}
                />
                <ReviewRow
                    label="Garage spaces"
                    value={property?.property?.garageSpaces}
                />
                <ReviewRow
                    label="Heating"
                    value={labelOf(
                        HEATING_OPTIONS,
                        property?.property?.heatingType,
                    )}
                />
                <ReviewRow
                    label="Cooling"
                    value={labelOf(
                        COOLING_OPTIONS,
                        property?.property?.coolingType,
                    )}
                />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Ownership & legal"
                onEdit={() => onEdit('ownership_legal_c')}
            >
                <ReviewRow
                    label="Owner name"
                    value={property?.property?.ownerName}
                />
                <ReviewRow
                    label="HOA name"
                    value={property?.property?.hoaName}
                />
                <ReviewRow label="Zoning" value={property?.property?.zoning} />
            </ReviewSectionCard>

            <ReviewSectionCard
                title="Description"
                onEdit={() => onEdit('description_c')}
            >
                <div className="py-3 text-sm whitespace-pre-line">
                    {property?.property?.description || (
                        <span className="text-muted-foreground">
                            No description added.
                        </span>
                    )}
                </div>
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

export default ReviewAndPublish;
