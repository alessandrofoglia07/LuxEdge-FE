import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

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
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onClick(name)}
                    className={`relative mx-2 h-4 w-4 cursor-pointer border border-slate-500 bg-primary-base shadow-md ${round ? 'rounded-full' : 'rounded-md'}`}>
                    <CheckIcon className='absolute inset-0 m-auto h-3 w-3 text-white' aria-hidden='true' />
                </motion.div>
            ) : (
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onClick(name)}
                    className={`relative mx-2 h-4 w-4 cursor-pointer border border-slate-300 bg-slate-50 shadow-md ${round ? 'rounded-full' : 'rounded-md'}`}
                />
            )}
            <h2 className='text-md select-none font-semibold'>{children}</h2>
        </div>
    );
};

export default Option;
