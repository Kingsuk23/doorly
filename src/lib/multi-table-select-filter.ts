import { Row, RowData, TableFeatures } from '@tanstack/react-table';

export const multiTableSelectFilter = <
    TFeatures extends TableFeatures,
    TData extends RowData,
>(
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: string[] | undefined,
): boolean => {
    if (!filterValue?.length) return true;
    return filterValue.includes(row.getValue<string>(columnId));
};
