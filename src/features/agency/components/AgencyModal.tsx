'use client';

import { cn } from 'cn';

import LogoType from '@/components/icons/brand/LogoType';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AgencyBasicForm from './AgencyBasicForm';
import { useAgencyWizard } from '../hooks/useAgencyWizard';
import AgencyContactForm from './AgencyContactForm';
import AgencyAddressForm from './AgencyAddressForm';
import AgencyProfileImage from './AgencyProfileImage';

const steps = ['basic_c', 'contact_c', 'address_c', 'logo_c'];

interface agencyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setImageUrlAgency: React.Dispatch<React.SetStateAction<string | null>>;
}

const AgencyModal: React.FC<agencyModalProps> = ({
    onOpenChange,
    open,
    setImageUrlAgency,
}) => {
    const {
        step,
        stepIndex,
        values,
        next,
        back,
        reset,
        coordinates,
        setCoordinates,
    } = useAgencyWizard();

    console.log(values);

    return (
        <Dialog
            open={open}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    reset();
                }
                onOpenChange(open);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <div className="rounded-lg bg-muted size-14 flex justify-center items-center">
                        <LogoType width={32} height={32} />
                    </div>
                    <DialogTitle className="mt-2 text-2xl font-bold">
                        New agency
                    </DialogTitle>
                    <DialogDescription>
                        Provide your agency’s details. It will be reviewed by
                        our team before verification.
                    </DialogDescription>
                </DialogHeader>

                {step === 'basic' && (
                    <AgencyBasicForm defaultValues={values} onNext={next} />
                )}
                {step === 'contact' && (
                    <AgencyContactForm
                        defaultValues={values}
                        onNext={next}
                        back={back}
                    />
                )}
                {step === 'address' && (
                    <AgencyAddressForm
                        defaultValues={values}
                        onNext={next}
                        back={back}
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                    />
                )}

                {step === 'logo' && (
                    <AgencyProfileImage
                        setImageUrlAgency={setImageUrlAgency}
                        defaultValues={values}
                        back={back}
                        values={values}
                        reset={reset}
                        onClose={onOpenChange}
                    />
                )}
                <div className="w-full flex gap-1.5 h-1">
                    {steps.map((s, i) => (
                        <div
                            key={s}
                            className="h-full w-full rounded-full bg-black/20"
                        >
                            <div
                                className={cn(
                                    'h-full w-0 rounded-full bg-black transition-all duration-300',
                                    i < stepIndex && 'w-full',
                                )}
                            />
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AgencyModal;
