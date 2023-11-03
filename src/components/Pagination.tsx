import { usePagination, dots } from '@/hooks/usePagination';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

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

    return (
        <ul className={`flex items-center gap-2 my-8 ${className}`}>
            <li
                id='arrow-left-container'
                className={`w-10 h-10 border-2 rounded-md border-primary-base group transition-colors mr-2 ${
                    currentPage === 1 ? 'opacity-40' : 'hover:border-primary-hover hover:bg-primary-base'
                }`}
            >
                <button onClick={onPrevious} disabled={currentPage === 1} className='w-full h-full grid place-items-center rounded-md'>
                    <ArrowLeftIcon className={`w-6 h-6 text-primary-base transition-colors ${currentPage !== 1 && 'group-hover:text-white'}`} />
                </button>
            </li>
            {paginationRange?.map((pageNumber: number | string, i: number) => {
                if (pageNumber === dots) {
                    return (
                        <li key={i} className='w-10 h-10 grid rounded-md place-items-center pb-2 text-xl font-semibold border-2 border-primary-base pointer-events-none select-none'>
                            &#8230;
                        </li>
                    );
                }
                return (
                    <li
                        key={i}
                        className={`w-10 h-10 border-2 rounded-md border-primary-base hover:border-primary-hover hover:bg-primary-base transition-colors group ${
                            currentPage === pageNumber && 'bg-primary-base'
                        }`}
                    >
                        <button
                            className={`w-full h-full grid place-items-center text-xl font-semibold group-hover:text-white ${currentPage === pageNumber && 'text-white'}`}
                            onClick={() => onPageChange(pageNumber as number)}
                        >
                            {pageNumber}
                        </button>
                    </li>
                );
            })}
            <li
                id='arrow-right-container'
                className={`w-10 h-10 border-2 rounded-md border-primary-base group transition-colors ml-2 ${
                    currentPage === lastPage ? 'opacity-40' : 'hover:border-primary-hover hover:bg-primary-base'
                }`}
            >
                <button onClick={onNext} disabled={currentPage === lastPage} className='w-full h-full grid place-items-center rounded-md'>
                    <ArrowRightIcon className={`w-6 h-6 text-primary-base group-hover:text-primary-hover transition-colors ${currentPage !== lastPage && 'group-hover:text-white'}`} />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
