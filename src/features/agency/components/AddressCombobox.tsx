'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeoapifyFormattedAutocompleteJSON } from '@/features/address/type/address';
import { UseFormSetValues } from 'react-hook-form';
import { agencyAddressInput } from '../schema/agencySchema';

interface AddressComboboxProps {
    options?: readonly GeoapifyFormattedAutocompleteJSON[];
    value?: string;
    onValueChange?: (value: string) => void;
    onSelect?: (option: GeoapifyFormattedAutocompleteJSON) => void;
    onSearchChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
    isLoading?: boolean;
    isError?: boolean;
}

const AddressCombobox = ({
    options,
    value,
    onValueChange,
    onSelect,
    onSearchChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    className,
    disabled,
    id,
    isLoading = false,
    isError = false,
}: AddressComboboxProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const list = Array.isArray(options) ? options : [];

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) {
            setQuery('');
            setActiveIndex(0);
        }
    };

    const select = (option: GeoapifyFormattedAutocompleteJSON) => {
        onValueChange?.(option.street || option.formatted);
        onSelect?.(option);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, list.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const option = list[activeIndex];
            if (option) select(option);
        }
    };

    const renderBody = () => {
        if (isError) {
            return (
                <li className="py-4 text-center text-sm text-destructive">
                    Something went wrong. Please try again.
                </li>
            );
        }

        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="px-2 py-1.5">
                    <Skeleton className="h-4 w-full" />
                </li>
            ));
        }

        if (list.length === 0) {
            return (
                <li className="py-4 text-center text-sm text-muted-foreground">
                    {query.trim().length < 3
                        ? 'Type at least 3 characters'
                        : emptyText}
                </li>
            );
        }

        return list.map((option, index) => {
            const optionValue = option.street || option.formatted;

            return (
                <li
                    key={option.placeId}
                    role="option"
                    aria-selected={optionValue === value}
                    onClick={() => select(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                        index === activeIndex &&
                            'bg-accent text-accent-foreground',
                    )}
                >
                    <Check
                        className={cn(
                            'size-4 shrink-0',
                            index === activeIndex ? 'opacity-100' : 'opacity-0',
                        )}
                    />
                    {option.formatted}
                </li>
            );
        });
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between font-normal',
                        className,
                    )}
                >
                    <span className={cn(!value && 'text-muted-foreground')}>
                        {value || placeholder}
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width)"
            >
                <Input
                    value={query}
                    onChange={(e) => {
                        onSearchChange?.(e.target.value);
                        setQuery(e.target.value);
                        setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={searchPlaceholder}
                    className="w-full"
                />

                <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                    {renderBody()}
                </ul>
            </PopoverContent>
        </Popover>
    );
};

export default AddressCombobox;
