import { typeAndLocationInput } from './schemas/new-property-zod-schemas';

export type typeAndLocationUpdateType = {
    id: string;
    body: typeAndLocationInput;
};
