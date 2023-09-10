import React, { DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type AnchorProps = DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type Props = (ButtonProps | AnchorProps) & {
    as?: 'button' | 'a';
    secondary?: boolean;
};

const Button: React.FC<Props> = (props: Props) => {
    const Component = props.as || 'button';

    const newProps = { ...props };

    delete newProps.as;
    delete newProps.secondary;
    delete newProps.className;

    return (
        <Component
            className={
                props.secondary
                    ? `font-bold text-lg lg:mx-4 sm:mx-2 flex items-center gap-1 select-none ${props.className}`
                    : `transition-colors duration-200 font-bold text-lg px-4 py-2 select-none rounded-xl text-white bg-primary-base hover:bg-primary-hover mx-4 ${props.className}`
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(newProps as any)}>
            {props.children}
        </Component>
    );
};

export default Button;
