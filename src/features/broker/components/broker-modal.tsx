'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { steps } from '../constants/broker-form-steps';
import LogoIcon from '@/components/icons/brand/logo-icon';
import { cn } from 'cn';
import { useBrokerForm } from '../hooks/use-broker-form';
import BrokeBasicInfoFrom from './forms/broker-basic-info-form';
import BrokerContactInfoForm from './forms/broker-contact-info-form';
import BrokerAddressInfoForm from './forms/broker-address-info-schema';
import BrokerAvatarInfoForm from './forms/broker-avatar-info-form';

interface BrokerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBrokerCreated: (id: string) => void;
    setBrokerAvatarId: React.Dispatch<React.SetStateAction<null | string>>;
}

const BrokerModal = ({
    onBrokerCreated,
    onOpenChange,
    open,
    setBrokerAvatarId,
}: BrokerModalProps) => {
    const { back, next, reset, step, stepIndex, values } = useBrokerForm();
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
                        <LogoIcon width={32} height={32} />
                    </div>
                    <DialogTitle className="mt-2 text-2xl font-bold">
                        New agency
                    </DialogTitle>
                    <DialogDescription>
                        Provide your agency’s details. It will be reviewed by
                        our team before verification.
                    </DialogDescription>
                </DialogHeader>

                {step === 'basic_c' && (
                    <BrokeBasicInfoFrom defaultValues={values} onNext={next} />
                )}
                {step === 'contact_c' && (
                    <BrokerContactInfoForm
                        defaultValues={values}
                        onBack={back}
                        onNext={next}
                    />
                )}
                {step === 'address_c' && (
                    <BrokerAddressInfoForm
                        defaultValues={values}
                        onBack={back}
                        onNext={next}
                    />
                )}
                {step === 'logo_c' && (
                    <BrokerAvatarInfoForm
                        defaultValues={values}
                        values={values}
                        onBack={back}
                        onBrokerCreated={onBrokerCreated}
                        onClose={onOpenChange}
                        reset={reset}
                        setAvatarId={setBrokerAvatarId}
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

export default BrokerModal;
