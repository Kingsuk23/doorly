'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '../../../components/ui/input';

export interface ComboboxOption {
    label: string;
    value: string;
}

interface AgencyComboboxProps {
    options: readonly ComboboxOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

const AgencyCombobox = ({
    options,
    value,
    onValueChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    className,
    disabled,
    id,
}: AgencyComboboxProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const selected = options.find((o) => o.value === value);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q
            ? options.filter((o) => o.label.toLowerCase().includes(q))
            : options;
    }, [options, query]);

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) {
            setQuery('');
            setActiveIndex(0);
        }
    };

    const select = (option: ComboboxOption) => {
        onValueChange?.(option.value);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const option = filtered[activeIndex];
            if (option) select(option);
        }
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
                    <span className={cn(!selected && 'text-muted-foreground')}>
                        {selected?.label ?? placeholder}
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
                        setQuery(e.target.value);
                        setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={searchPlaceholder}
                    className="w-full border-b bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />

                <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                    {filtered.length === 0 && (
                        <li className="py-4 text-center text-sm text-muted-foreground">
                            {emptyText}
                        </li>
                    )}

                    {filtered.map((option, index) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value}
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
                                    'size-4',
                                    option.value === value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                )}
                            />

                            {option.label}
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
};

export default AgencyCombobox;
