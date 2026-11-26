import {
    tableFeatures,
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    sortFn_alphanumeric,
    sortFn_text,
} from '@tanstack/react-table';

export const ListingsDataTableFeatures = tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

export type ListingsDataTableFeaturesType = typeof ListingsDataTableFeatures;
