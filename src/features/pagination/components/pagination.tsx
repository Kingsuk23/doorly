import { Button } from '@/components/ui/button';
import { usePagination, DOTS } from '../hooks/usePagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    siblingCount: number;
    onPervious: () => void;
    onNext: () => void;
    isPerviousDisable: boolean;
    isNextDisable: boolean;
    setPage: (page: number | string) => void;
}

const Pagination = ({
    currentPage,
    pageSize,
    totalCount,
    siblingCount,
    onNext,
    onPervious,
    isPerviousDisable,
    isNextDisable,
    setPage,
}: PaginationProps) => {
    const pages = usePagination({
        totalCount,
        pageSize,
        currentPage,
        siblingCount,
    });

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                onClick={onPervious}
                disabled={isPerviousDisable}
                size="icon-lg"
            >
                <ChevronLeft />
            </Button>

            {pages.map((page, i) =>
                page === DOTS ? (
                    <span key={`dots-${i}`}>…</span>
                ) : (
                    <Button
                        size="icon-lg"
                        key={page}
                        onClick={() => setPage(page)}
                    >
                        {page}
                    </Button>
                ),
            )}

            <Button onClick={onNext} disabled={isNextDisable} size="icon-lg">
                <ChevronRight />
            </Button>
        </div>
    );
};

export default Pagination;
