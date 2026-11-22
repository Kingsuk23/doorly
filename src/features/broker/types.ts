import { brokerAddressInfoInput } from './schemas/broker-address-info-zod-schema';
import { brokerAvatarInfoInput } from './schemas/broker-avatar-info-zod-schema';
import { brokerBasicInfoInput } from './schemas/broker-basic-info-zod-schema';
import { brokerContactInfoInput } from './schemas/broker-contact-info-zod-schema';

export type brokerFormValues = brokerBasicInfoInput &
    brokerContactInfoInput &
    brokerAddressInfoInput &
    brokerAvatarInfoInput;
