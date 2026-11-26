import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from 'cn';
import { ChevronDown, Filter } from 'lucide-react';

type Option = { label: string; value: string };

interface ColumnFilterHeaderProps {
    title: string;
    value: string[] | undefined;
    options: Option[];
    onChange: (value: string[] | undefined) => void;
    className?: string;
}

const ColumnFilterHeader = ({
    onChange,
    options,
    title,
    value,
    className,
}: ColumnFilterHeaderProps) => {
    const selected = value ?? [];
    const toggle = (optionValue: string, checked: boolean) => {
        const next = checked
            ? [...selected, optionValue]
            : selected.filter((v) => v !== optionValue);

        onChange(next);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="sm" className="w-fit p-0" />
                }
            >
                {title}
                {selected.length > 0 ? <Filter /> : <ChevronDown />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={cn(className)}>
                <DropdownMenuGroup>
                    {options.map((item) => (
                        <DropdownMenuCheckboxItem
                            key={item.label}
                            checked={
                                selected.includes(item.value) ? true : false
                            }
                            onCheckedChange={(checked) => {
                                toggle(item.value, checked);
                            }}
                            closeOnClick={false}
                        >
                            {item.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>

                {selected.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onChange(undefined)}>
                            Clear filter
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ColumnFilterHeader;
