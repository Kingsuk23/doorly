'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Loader } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
    listingFormStepId,
    listingFormSteps,
} from '../constants/listing-forms-steps';
import ListingWizardStepper from './listing-wizard-stepper';
import ListingBasicForm from './form/listing-basic-form';
import { listingKey } from '../queries/listing-queries';
import {
    basicsInput,
    mediaFormInput,
    pricingInput,
    scheduleInput,
} from '../schemas/zod-listings-schema';
import { updateListing } from '../actions/listing-action';
import ListingPricingForm from './form/listing-pricing-form';
import ListingScheduleForm from './form/listing-schedule-form';
import ListingReviewAndPublish from './listing-review-and-publish';
import ListingMediaForm from './form/listing-media-from';
import { createOrUpdateListingMedia } from '../actions/listing-image-action';
import { useImageKitUploads } from '@/features/dropzone/store/image-kit-upload';

interface ListingWizardProps {
    listingId: string;
}

const ListingWizard = ({ listingId }: ListingWizardProps) => {
    const fileUploads = useImageKitUploads((state) => state.uploadState);
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const foundIndex = listingFormSteps.findIndex(
        (s) => s.id === searchParams.get('step'),
    );
    const stepIndex = foundIndex === -1 ? 0 : foundIndex;
    const step = listingFormSteps[stepIndex];

    const isFirst = stepIndex === 0;
    const isLast = stepIndex === listingFormSteps.length - 1;

    const goTo = (index: number) => {
        const target =
            listingFormSteps[
                Math.min(Math.max(index, 0), listingFormSteps.length - 1)
            ];
        router.push(`/listings/new/${listingId}/edit?step=${target.id}`);
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

                await queryClient.invalidateQueries({
                    queryKey: listingKey.getListingById(listingId),
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

    const handlePublicSubmit = () => {
        startTransition(async () => {
            try {
                const res = await updateListing({
                    listingId,
                    stepId: step.id as listingFormStepId,
                    body: { status: 'active' },
                });
                if (!res.success) {
                    toast.add({
                        type: 'error',
                        description: res.error.message,
                    });
                    return;
                }

                await queryClient.invalidateQueries({
                    queryKey: listingKey.getListingById(listingId),
                });
                router.push('/agent-profile');
                router.refresh();
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Something went wrong. Please try again.',
                });
            }
        });
    };

    const handleSubmit = (values: basicsInput) =>
        saveAndContinue(() =>
            updateListing({
                listingId,
                body: values,
                stepId: step.id as listingFormStepId,
            }),
        );

    const handlePricingSubmit = (values: pricingInput) =>
        saveAndContinue(() =>
            updateListing({
                listingId,
                body: values,
                stepId: step.id as listingFormStepId,
            }),
        );

    const handleScheduleSubmit = (values: scheduleInput) =>
        saveAndContinue(() =>
            updateListing({
                listingId,
                body: values,
                stepId: step.id as listingFormStepId,
            }),
        );

    const handleMediaSubmit = (values: mediaFormInput) => {
        startTransition(async () => {
            try {
                const res = await createOrUpdateListingMedia({
                    listingId,
                    body: values,
                    stepId: step.id as listingFormStepId,
                });
                if (!res.success) {
                    toast.add({
                        type: 'error',
                        description: res.error.message,
                    });
                    return;
                }

                await queryClient.invalidateQueries({
                    queryKey: listingKey.listingMedia(listingId),
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
    return (
        <div className="grid gap-8 p-4 md:grid-cols-[240px_1fr] md:gap-12 md:p-8">
            <ListingWizardStepper currentIndex={stepIndex} onStepClick={goTo} />
            <section aria-live="polite">
                <p className="text-muted-foreground text-sm">
                    {stepIndex + 1}/{listingFormSteps.length}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {step.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-prose text-sm">
                    {step.description}
                </p>

                <div className="mt-8">
                    {step.id === 'basic_c' && (
                        <ListingBasicForm
                            id={listingId}
                            formId={step.id}
                            onSubmit={handleSubmit}
                        />
                    )}
                    {step.id === 'pricing_c' && (
                        <ListingPricingForm
                            id={listingId}
                            formId={step.id}
                            onSubmit={handlePricingSubmit}
                        />
                    )}
                    {step.id === 'schedule_c' && (
                        <ListingScheduleForm
                            id={listingId}
                            formId={step.id}
                            onSubmit={handleScheduleSubmit}
                        />
                    )}
                    {step.id === 'review_publish_c' && (
                        <ListingReviewAndPublish
                            formId={step.id}
                            listingId={listingId}
                            onEdit={(stepId) =>
                                goTo(
                                    listingFormSteps.findIndex(
                                        (s) => s.id === stepId,
                                    ),
                                )
                            }
                            onPublished={handlePublicSubmit}
                        />
                    )}
                    {step.id === 'media_c' && (
                        <ListingMediaForm
                            formId={step.id}
                            listingId={listingId}
                            onSubmit={handleMediaSubmit}
                        />
                    )}
                </div>

                <div className="mt-10 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={goBack}
                        disabled={isFirst || isPending || fileUploads}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        form={step.id}
                        disabled={isPending || fileUploads}
                    >
                        {isPending && <Loader className="animate-spin" />}
                        {isLast ? 'Publish property' : 'Next'}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ListingWizard;
