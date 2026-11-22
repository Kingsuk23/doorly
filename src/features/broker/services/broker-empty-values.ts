import { brokerFormValues } from '../types';

export const emptyBrokerInfoForm: brokerFormValues = {
    name: '',
    description: '',
    license: '',
    email: '',
    phone: '',
    website: '',
    street_address_1: '',
    street_address_2: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    avatar: {
        fileId: '',
        url: '',
    },
};
