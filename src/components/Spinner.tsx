import React from 'react';

interface Props {
    className?: string;
}

const Spinner: React.FC<Props> = ({ className }: Props) => {
    return (
        <div
            className={`inline-block h-12 w-12 animate-spin rounded-full border-2 border-solid border-current border-r-transparent text-slate-700 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
            role='status'
        >
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
        </div>
    );
};

export default Spinner;
