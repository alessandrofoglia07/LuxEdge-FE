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
                className={`flex select-none items-center gap-4 rounded-lg bg-slate-200 px-6 py-3 transition-all duration-[20ms] focus-within:outline focus-within:outline-offset-1 focus-within:outline-blue-500 ${
                    props.containerClassName?.includes('w-') && 'w-full [&>input]:w-full'
                }`}>
                <input type={type} className={`bg-slate-200 py-[.25rem] text-lg leading-3 tracking-tight outline-none ${props.className}`} {...inputProps} />
                {props.type === 'password' && type === 'password' ? (
                    <button type='button' className='-m-1 rounded-full p-1 focus:bg-slate-300 focus:outline-none' onClick={() => setType('text')}>
                        <ViewPass className='h-6 w-6 text-gray-500' />
                    </button>
                ) : props.type === 'password' && type === 'text' ? (
                    <button type='button' className='-m-1 rounded-full p-1 focus:bg-slate-300 focus:outline-none' onClick={() => setType('password')}>
                        <NotViewPass className='h-6 w-6 text-gray-500' />
                    </button>
                ) : null}
            </div>
            {props.error && <p className='absolute px-1 text-sm tracking-tight text-primary-hover'>{props.helperText}</p>}
        </div>
    );
};

export default Input;
