import React, { useState, useEffect, HTMLInputTypeAttribute, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { EyeIcon as ViewPass, EyeSlashIcon as NotViewPass } from '@heroicons/react/20/solid';

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    helperText?: string;
    error?: boolean;
    containerClassName?: string;
}

const Input: React.FC<Props> = (props: Props) => {
    const [type, setType] = useState<HTMLInputTypeAttribute>(props.type || 'text');

    useEffect(() => {
        setType(props.type || 'text');
    }, [props.type]);

    const inputProps = { ...props };
    delete inputProps.containerClassName;
    delete inputProps.className;
    delete inputProps.helperText;
    delete inputProps.error;
    delete inputProps.type;

    return (
        <div id='input' className={props.containerClassName}>
            <div
                className={`bg-slate-200 px-6 py-3 flex items-center gap-4 rounded-lg focus-within:outline focus-within:outline-blue-500 focus-within:outline-offset-1 ${
                    props.containerClassName?.includes('w-') && 'w-full [&>input]:w-full'
                }`}>
                <input type={type} className={`bg-slate-200 text-lg tracking-tight py-[.25rem] leading-3 outline-none ${props.className}`} {...inputProps} />
                {props.type === 'password' && type === 'password' ? (
                    <button type='button' className='focus:outline-none' onClick={() => setType('text')}>
                        <ViewPass className='w-6 h-6 text-gray-500' />
                    </button>
                ) : props.type === 'password' && type === 'text' ? (
                    <button type='button' className='focus:outline-none' onClick={() => setType('password')}>
                        <NotViewPass className='w-6 h-6 text-gray-500' />
                    </button>
                ) : null}
            </div>
            {props.error && <p className='text-sm text-red-600 px-1 tracking-tight'>{props.helperText}</p>}
        </div>
    );
};

export default Input;
