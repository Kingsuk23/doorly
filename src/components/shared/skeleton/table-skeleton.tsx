import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const headers = [
    'Property type',
    'Owner name',
    'Bedrooms',
    'Bathrooms',
    'Garage',
    'Build year',
    'Area size',
    'Status',
    'Created at',
    'Actions',
];

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="rounded-md border mt-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header}>
                                <Skeleton className="h-4 w-12" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {headers.map((header) => (
                                <TableCell key={header}>
                                    {header === 'Actions' ? (
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    ) : (
                                        <Skeleton className="h-4 w-full max-w-24" />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableSkeleton;
