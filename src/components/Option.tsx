import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

interface Props {
    round?: boolean;
    checked: boolean;
    onClick: (name?: string) => void;
    children?: string;
    name?: string;
    className?: string;
}

const Option: React.FC<Props> = ({ round = false, checked, onClick, children, name, className }: Props) => {
    return (
        <div id='Option' className={`flex items-center ${className || ''}`}>
            {checked ? (
                <div
                    onClick={() => onClick(name)}
                    className={`relative mx-2 h-4 w-4 bg-primary-base border border-slate-500 shadow-md cursor-pointer ${round ? 'rounded-full' : 'rounded-md'}`}>
                    <CheckIcon className='absolute inset-0 m-auto h-3 w-3 text-white' aria-hidden='true' />
                </div>
            ) : (
                <div
                    onClick={() => onClick(name)}
                    className={`relative mx-2 h-4 w-4 bg-slate-50 border border-slate-300 shadow-md cursor-pointer ${round ? 'rounded-full' : 'rounded-md'}`}
                />
            )}
            <h2 className='font-semibold text-md select-none'>{children}</h2>
        </div>
    );
};

export default Option;
