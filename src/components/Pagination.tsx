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
        <ul className={`my-8 flex items-center gap-2 ${className}`}>
            <li
                id='arrow-left-container'
                className={`group mr-2 h-10 w-10 rounded-md border-2 border-primary-base transition-colors ${
                    currentPage === 1 ? 'opacity-40' : 'hover:border-primary-hover hover:bg-primary-base'
                }`}>
                <button onClick={onPrevious} disabled={currentPage === 1} className='grid h-full w-full place-items-center rounded-md'>
                    <ArrowLeftIcon className={`h-6 w-6 text-primary-base transition-colors ${currentPage !== 1 && 'group-hover:text-white'}`} />
                </button>
            </li>
            {paginationRange?.map((pageNumber: number | string, i: number) => {
                if (pageNumber === dots) {
                    return (
                        <li key={i} className='pointer-events-none grid h-10 w-10 select-none place-items-center rounded-md border-2 border-primary-base pb-2 text-xl font-semibold'>
                            &#8230;
                        </li>
                    );
                }
                return (
                    <li
                        key={i}
                        className={`group h-10 w-10 rounded-md border-2 border-primary-base transition-colors hover:border-primary-hover hover:bg-primary-base ${
                            currentPage === pageNumber && 'bg-primary-base'
                        }`}>
                        <button
                            className={`grid h-full w-full place-items-center text-xl font-semibold group-hover:text-white ${currentPage === pageNumber && 'text-white'}`}
                            onClick={() => onPageChange(pageNumber as number)}>
                            {pageNumber}
                        </button>
                    </li>
                );
            })}
            <li
                id='arrow-right-container'
                className={`group ml-2 h-10 w-10 rounded-md border-2 border-primary-base transition-colors ${
                    currentPage === lastPage ? 'opacity-40' : 'hover:border-primary-hover hover:bg-primary-base'
                }`}>
                <button onClick={onNext} disabled={currentPage === lastPage} className='grid h-full w-full place-items-center rounded-md'>
                    <ArrowRightIcon className={`h-6 w-6 text-primary-base transition-colors group-hover:text-primary-hover ${currentPage !== lastPage && 'group-hover:text-white'}`} />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
