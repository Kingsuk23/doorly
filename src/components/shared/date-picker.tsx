'use client';

import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from 'cn';

type DatePickerProps = {
    id?: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: (date: Date) => boolean;
    invalid?: boolean;
};

export function DatePicker({
    id,
    value,
    onChange,
    placeholder = 'Pick a date',
    disabled,
    invalid,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        aria-invalid={invalid}
                        className={cn(
                            'w-full h-10 justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                        )}
                    />
                }
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, 'PPP') : placeholder}
                {value && (
                    <X
                        className="ml-auto h-4 w-4 opacity-60 hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(undefined);
                        }}
                    />
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
