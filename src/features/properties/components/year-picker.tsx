'use client';

import { useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const MIN_YEAR = 1600;
const CURRENT_YEAR = new Date().getFullYear();
const ROW_HEIGHT = 36;

const YEARS = Array.from(
    { length: CURRENT_YEAR - MIN_YEAR + 1 },
    (_, i) => CURRENT_YEAR - i,
);

type Props = {
    id?: string;
    value?: number;
    onChange: (year: number) => void;
    placeholder?: string;
    'aria-invalid'?: boolean;
};

const YearPicker = ({
    id,
    value,
    onChange,
    placeholder = 'Select build year',
    'aria-invalid': invalid,
}: Props) => {
    const [open, setOpen] = useState(false);

    const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer({
        count: YEARS.length,
        getScrollElement: () => scrollEl,
        estimateSize: () => ROW_HEIGHT,
        overscan: 8,
    });

    useEffect(() => {
        if (!scrollEl || value == null) return;
        const index = YEARS.indexOf(value);
        if (index === -1) return;
        const frame = requestAnimationFrame(() =>
            virtualizer.scrollToIndex(index, { align: 'center' }),
        );
        return () => cancelAnimationFrame(frame);
    }, [scrollEl, value, virtualizer]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-invalid={invalid}
                        className={cn(
                            'h-10 w-full justify-between text-base font-normal',
                            value == null && 'text-muted-foreground',
                        )}
                    />
                }
            >
                {value ?? placeholder}
                <ChevronDown className="size-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-(--anchor-width) min-w-40 p-0"
            >
                <div
                    ref={setScrollEl}
                    role="listbox"
                    className="h-72 overflow-auto p-1"
                >
                    <div
                        className="relative w-full"
                        style={{ height: virtualizer.getTotalSize() }}
                    >
                        {virtualizer.getVirtualItems().map((row) => {
                            const year = YEARS[row.index];
                            const selected = year === value;

                            return (
                                <button
                                    key={year}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => {
                                        onChange(year);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        'hover:bg-accent focus-visible:bg-accent absolute top-0 left-0 flex w-full items-center justify-between rounded-md px-2 text-sm outline-none',
                                        selected && 'font-semibold',
                                    )}
                                    style={{
                                        height: row.size,
                                        transform: `translateY(${row.start}px)`,
                                    }}
                                >
                                    {year}
                                    {selected && <Check className="size-4" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default YearPicker;
