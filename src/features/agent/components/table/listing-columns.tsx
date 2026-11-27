'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { listingRow } from '../../types';
import { dateFormatter } from '@/lib/date-formatter';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { multiTableSelectFilter } from '@/lib/multi-table-select-filter';
import { ListingsDataTableFeaturesType } from '../../services/listings-data-table-features';
import ColumnFilterHeader from '@/components/shared/column-filter-header';
import { listingTypes } from '../../constants/listing-types';
import {
    listingStatuses,
    listingStatusStyles,
} from '../../constants/listing-statuses';
import { cn } from 'cn';
import ListingActionCell from '../listing-actions-cell';

const helper = createColumnHelper<ListingsDataTableFeaturesType, listingRow>();

export const listingColumns = helper.columns([
    helper.accessor('title', {
        header: 'Title',
        cell: ({ getValue }) => {
            const text = getValue();
            return text ? capitalizeFirstLetter(text) : '-';
        },
    }),
    helper.accessor('listing_type', {
        header: ({ column }) => (
            <ColumnFilterHeader
                onChange={(value) => column.setFilterValue(value)}
                options={listingTypes}
                title="Listing type"
                value={column.getFilterValue() as string[] | undefined}
            />
        ),
        cell: ({ getValue }) => {
            const text = getValue();
            return text ? capitalizeFirstLetter(text) : '-';
        },
        filterFn: multiTableSelectFilter,
    }),
    helper.accessor('price', {
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
                    Price <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const bathrooms = getValue();

            return bathrooms ? Number(bathrooms) : '-';
        },
    }),
    helper.accessor('status', {
        header: ({ column }) => (
            <ColumnFilterHeader
                onChange={(value) => column.setFilterValue(value)}
                options={listingStatuses}
                title="Listing statuses"
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
                        listingStatusStyles[text],
                    )}
                >
                    {capitalizeText}
                </div>
            );
        },
        filterFn: multiTableSelectFilter,
    }),

    helper.accessor('listed_at', {
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
    //todo: add view/inquiries count
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
                <ListingActionCell
                    id={row.original.id}
                    stepId={row.original.listingStepProgress?.stepId}
                />
            );
        },
    }),
]);
