'use client';

import {
    SortingState,
    useTable,
    type ColumnDef,
    type RowData,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import Pagination from '@/features/pagination/components/pagination';
import { useState } from 'react';
import {
    ListingsDataTableFeaturesType,
    ListingsDataTableFeatures,
} from '../../services/listings-data-table-features';

interface ListingDataTableProps<TData extends RowData> {
    columns: ColumnDef<ListingsDataTableFeaturesType, TData>[];
    data: TData[];
}

function ListingDataTable<TData extends RowData>({
    columns,
    data,
}: ListingDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useTable({
        features: ListingsDataTableFeatures,
        columns,
        data,
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const totalCount = table.getFilteredRowModel().rows.length;
    const pageSize = table.state.pagination.pageSize;
    const currentPage = table.state.pagination.pageIndex + 1;

    return (
        <div>
            <div className="overflow-hidden rounded-md border mt-10">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender
                                                    header={header}
                                                />
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                isNextDisable={!table.getCanNextPage()}
                isPerviousDisable={!table.getCanPreviousPage()}
                onNext={() => table.nextPage()}
                onPervious={() => table.previousPage()}
                pageSize={pageSize}
                setPage={(page) => table.setPageIndex((page as number) - 1)}
                siblingCount={1}
                totalCount={totalCount}
            />
        </div>
    );
}

export default ListingDataTable;
