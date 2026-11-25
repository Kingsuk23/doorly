'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { propertiesDataTableFeaturesType } from '../../services/properties-data-table-features';
import { PropertyRow } from '../../types';
import { dateFormatter } from '@/lib/date-formatter';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import PropertyActionSell from '../property-action-cell';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import ColumnFilterHeader from './column-filter-header';
import { statusOptions } from '../../constants/status-options';
import { multiTableSelectFilter } from '@/lib/multi-table-select-filter';
import { PropertyTypeOptions } from '../../constants/property-type-options';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const helper = createColumnHelper<
    propertiesDataTableFeaturesType,
    PropertyRow
>();

export const propertiesColumns = helper.columns([
    helper.accessor('property_type', {
        header: ({ column }) => (
            <ColumnFilterHeader
                title="Property type"
                onChange={(value) => column.setFilterValue(value)}
                value={column.getFilterValue() as string[] | undefined}
                options={PropertyTypeOptions}
                className="w-fit"
            />
        ),
        cell: ({ getValue }) => {
            const text = getValue();
            return text ? capitalizeFirstLetter(text) : '-';
        },
        filterFn: multiTableSelectFilter,
    }),
    helper.accessor('bedrooms', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Bedrooms <ArrowUpDown />
                </Button>
            );
        },
    }),
    helper.accessor('bathrooms', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Bathrooms <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const bathrooms = getValue();

            return bathrooms ? Number(bathrooms).toFixed(0) : '-';
        },
    }),
    helper.accessor('garage', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Garage <ArrowUpDown />
                </Button>
            );
        },
    }),
    helper.accessor('build_year', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Build year <ArrowUpDown />
                </Button>
            );
        },
    }),
    helper.accessor('area_size', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Area size <ArrowUpDown />
                </Button>
            );
        },
    }),
    helper.accessor('status', {
        header: ({ column }) => (
            <ColumnFilterHeader
                onChange={(value) => column.setFilterValue(value)}
                options={statusOptions}
                title="Status"
                value={column.getFilterValue() as string[] | undefined}
            />
        ),
        cell: ({ getValue }) => {
            const text = getValue();
            const capitalizeText = text ? capitalizeFirstLetter(text) : '-';
            return (
                <div
                    className={cn(
                        'rounded-full w-fit px-2 py-1',
                        text === 'draft' && 'text-yellow-600 bg-yellow-200',
                        text === 'publish' && 'text-green-600 bg-green-200',
                        text === 'hidden' && 'text-red-600 bg-red-200',
                    )}
                >
                    {capitalizeText}
                </div>
            );
        },
        filterFn: multiTableSelectFilter,
    }),

    helper.accessor('agents', {
        header: 'Agents',
        cell: ({ row }) => {
            const agents = row.original.agents;
            if (agents.length === 0)
                return (
                    <span className="text-muted-foreground">Unassigned</span>
                );

            const shown = agents.slice(0, 3);
            const extra = agents.length - shown.length;

            return (
                <div className="flex items-center">
                    <div className="flex -space-x-2">
                        {shown.map((a) => (
                            <Avatar
                                key={a.userId}
                                className="size-6 border-2 border-background"
                            >
                                <AvatarImage src={a.image ?? undefined} />
                                <AvatarFallback>{a.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    {extra > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            +{extra}
                        </span>
                    )}
                    {agents.some((a) => a.status === 'pending') && (
                        <Badge variant="outline" className="ml-2">
                            Pending
                        </Badge>
                    )}
                </div>
            );
        },
    }),

    helper.accessor('created_at', {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Listed at <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const date = getValue();
            return date ? dateFormatter.format(date) : '—';
        },
    }),

    helper.display({
        header: () => {
            return (
                <Button variant="ghost" size="sm" className="w-fit p-0">
                    Actions
                </Button>
            );
        },
        id: 'action',
        cell: ({ row }) => {
            return (
                <PropertyActionSell
                    status={row.original.status}
                    id={row.original.id}
                    stepId={row.original.stepId}
                />
            );
        },
    }),
]);
