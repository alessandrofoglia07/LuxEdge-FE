import { usePagination, dots } from '@/hooks/usePagination';

interface Props {
    onPageChange: (page: number) => void;
    totalCount: number;
    siblingCount?: number;
    currentPage: number;
    pageSize: number;
    className?: string;
}

const Pagination = ({ onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className }: Props) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || (paginationRange?.length && paginationRange?.length < 2)) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    const lastPage = paginationRange ? paginationRange[paginationRange?.length - 1] : 0;

    // TODO: Add styles
    return (
        <ul className={`${className}`}>
            <li id='arrow-left-container'>
                <button onClick={onPrevious} disabled={currentPage === 1}>
                    <div />
                </button>
            </li>
            {paginationRange?.map((pageNumber: number | string, i: number) => {
                if (pageNumber === dots) {
                    return (
                        <li key={i} className='dots'>
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li key={i}>
                        <button onClick={() => onPageChange(pageNumber as number)}>{pageNumber}</button>
                    </li>
                );
            })}
            <li id='arrow-right-container'>
                <button onClick={onNext} disabled={currentPage === lastPage}>
                    <div />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
