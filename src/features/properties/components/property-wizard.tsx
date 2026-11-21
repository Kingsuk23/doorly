'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { StepIdType, steps } from '../constants/steps';
import TypeAndLocationForm from './forms/type_and_location_form';
import WizardStepper from './wizard-stepper';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { Loader } from 'lucide-react';
import {
    descriptionInput,
    ownershipAndLegalInput,
    parkingAndSystemInput,
    sizeAndLayoutInput,
    typeAndLocationInput,
} from '../schemas/new-property-zod-schemas';
import {
    updatePropertyDescription,
    updatePropertyLayout,
    updatePropertyLegals,
    updatePropertyLocation,
    updatePropertyParking,
    updatePropertyReleaseStatus,
} from '../actions/property-actions';
import { toast } from '@/components/ui/toast';
import { updateStep } from '../actions/property-step-progress-active';
import { useQueryClient } from '@tanstack/react-query';
import SizeAndLayoutForm from './forms/size_and_layout_form';
import ParkingAndSystemForm from './forms/parking-and-system-form';
import OwnerAndLegalForm from './forms/owner-and-legal-form';
import DescriptionForm from './forms/description-form';
import ReviewAndPublish from './review-and-publish';

interface PropertyWizardProps {
    propertyId: string;
}

const PropertyWizard = ({ propertyId }: PropertyWizardProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const foundIndex = steps.findIndex(
        (s) => s.id === searchParams.get('step'),
    );
    const stepIndex = foundIndex === -1 ? 0 : foundIndex;
    const step = steps[stepIndex];

    const isFirst = stepIndex === 0;
    const isLast = stepIndex === steps.length - 1;

    const goTo = (index: number) => {
        const target = steps[Math.min(Math.max(index, 0), steps.length - 1)];
        router.push(`/properties/new/${propertyId}/edit?step=${target.id}`);
    };

    const goNext = () => goTo(stepIndex + 1);
    const goBack = () => goTo(stepIndex - 1);

    const saveAndContinue = (
        save: () => Promise<
            { success: true } | { success: false; error: { message: string } }
        >,
    ) => {
        startTransition(async () => {
            try {
                const res = await save();
                if (!res.success) {
                    toast.add({
                        type: 'error',
                        description: res.error.message,
                    });
                    return;
                }

                const stepRes = await updateStep(
                    propertyId,
                    step.id as StepIdType,
                );
                if (!stepRes.success) {
                    toast.add({
                        type: 'error',
                        description: stepRes.error.message,
                    });
                    return;
                }

                await queryClient.invalidateQueries({
                    queryKey: ['get_property_by_member', propertyId],
                });
                goNext();
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Something went wrong. Please try again.',
                });
            }
        });
    };

    const handlePublish = () => {
        startTransition(async () => {
            try {
                const res = await updatePropertyReleaseStatus({
                    id: propertyId,
                    body: { releaseStatus: 'publish' },
                });
                if (!res.success) {
                    toast.add({
                        type: 'error',
                        description: res.error.message,
                    });
                    return;
                }

                const stepRes = await updateStep(
                    propertyId,
                    step.id as StepIdType,
                );
                if (!stepRes.success) {
                    toast.add({
                        type: 'error',
                        description: stepRes.error.message,
                    });
                    return;
                }

                await queryClient.invalidateQueries({
                    queryKey: ['get_property_by_member', propertyId],
                });
                router.push('/profile');
                router.refresh();
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Something went wrong. Please try again.',
                });
            }
        });
    };

    const handleSubmit = (values: typeAndLocationInput) =>
        saveAndContinue(() =>
            updatePropertyLocation({ id: propertyId, body: values }),
        );

    const handleLayoutSubmit = (values: sizeAndLayoutInput) =>
        saveAndContinue(() =>
            updatePropertyLayout({ id: propertyId, body: values }),
        );

    const handleParkingSubmit = (values: parkingAndSystemInput) =>
        saveAndContinue(() =>
            updatePropertyParking({ id: propertyId, body: values }),
        );

    const handleLegalSubmit = (values: ownershipAndLegalInput) =>
        saveAndContinue(() =>
            updatePropertyLegals({ id: propertyId, body: values }),
        );

    const handleDescriptionSubmit = (values: descriptionInput) =>
        saveAndContinue(() =>
            updatePropertyDescription({ id: propertyId, body: values }),
        );

    return (
        <div className="grid gap-8 p-4 md:grid-cols-[240px_1fr] md:gap-12 md:p-8">
            <WizardStepper currentIndex={stepIndex} onStepClick={goTo} />
            <section aria-live="polite">
                <p className="text-muted-foreground text-sm">
                    {stepIndex + 1}/{steps.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {step.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-prose text-sm">
                    {step.description}
                </p>

                <div className="mt-8">
                    {step.id === 'location_c' && (
                        <TypeAndLocationForm
                            formId={step.id}
                            id={propertyId}
                            onSubmit={handleSubmit}
                        />
                    )}
                    {step.id === 'layout_c' && (
                        <SizeAndLayoutForm
                            formId={step.id}
                            id={propertyId}
                            onSubmit={handleLayoutSubmit}
                        />
                    )}
                    {step.id === 'parking_systems_c' && (
                        <ParkingAndSystemForm
                            formId={step.id}
                            id={propertyId}
                            onSubmit={handleParkingSubmit}
                        />
                    )}
                    {step.id === 'ownership_legal_c' && (
                        <OwnerAndLegalForm
                            formId={step.id}
                            id={propertyId}
                            onSubmit={handleLegalSubmit}
                        />
                    )}
                    {step.id === 'description_c' && (
                        <DescriptionForm
                            formId={step.id}
                            id={propertyId}
                            onSubmit={handleDescriptionSubmit}
                        />
                    )}

                    {step.id === 'review_publish_c' && (
                        <ReviewAndPublish
                            formId={step.id}
                            propertyId={propertyId}
                            onEdit={(stepId) =>
                                goTo(steps.findIndex((s) => s.id === stepId))
                            }
                            onPublished={handlePublish}
                        />
                    )}
                </div>

                <div className="mt-10 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={goBack}
                        disabled={isFirst || isPending}
                    >
                        Back
                    </Button>
                    <Button type="submit" form={step.id} disabled={isPending}>
                        {isPending && <Loader className="animate-spin" />}
                        {isLast ? 'Publish property' : 'Next'}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default PropertyWizard;
