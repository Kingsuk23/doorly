import type { ComponentProps } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
    label: string;
    value: string;
}

interface FilterSelectProps extends Omit<
    ComponentProps<typeof Select>,
    'children'
> {
    options: readonly SelectOption[];
    placeholder?: string;
    className?: string;
    ariaLabel?: string;
    triggerProps?: Omit<
        ComponentProps<typeof SelectTrigger>,
        'className' | 'children'
    >;
}

const SelectField = ({
    options,
    placeholder = 'All',
    className,
    ariaLabel,
    triggerProps,
    value,
    defaultValue = 'all',
    ...selectProps
}: FilterSelectProps) => {
    return (
        <Select
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            {...selectProps}
        >
            <SelectTrigger
                aria-label={ariaLabel}
                {...triggerProps}
                className={className}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectField;
