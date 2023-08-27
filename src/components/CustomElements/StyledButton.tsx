import React, { DetailedHTMLProps } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    /** If set, `onClick` property will not work anymore. */
    href?: string;
    classNameOverride?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
    const navigate = useNavigate();

    const newProps = { ...props };

    if (newProps.href) {
        newProps.onClick = () => navigate(newProps.href!);
        delete newProps.href;
    }

    delete newProps.className;
    delete newProps.children;
    delete newProps.classNameOverride;

    return (
        <button
            className={
                props.classNameOverride
                    ? props.className
                    : `font-bold text-lg px-4 py-2 select-none rounded-xl text-white bg-primary-base hover:bg-primarytext-primary-hover mx-4 ${props.className}`
            }
            {...newProps}>
            {props.children}
        </button>
    );
};

export default Button;
