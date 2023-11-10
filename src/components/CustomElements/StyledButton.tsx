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
                    ? `mx-4 flex select-none items-center gap-1 rounded-lg border-2 px-8 py-[6px] text-lg text-primary-base transition-colors duration-200 hover:border-primary-base hover:text-primary-hover ${props.className}`
                    : `mx-4 select-none rounded-lg bg-primary-base px-8 py-2 text-lg font-bold text-white transition-colors duration-200 hover:bg-primary-hover ${props.className}`
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(newProps as any)}>
            {props.children}
        </Component>
    );
};

export default Button;
