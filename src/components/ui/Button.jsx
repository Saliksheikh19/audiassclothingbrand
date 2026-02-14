import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-3 uppercase text-sm font-semibold transition-all duration-300 tracking-wider disabled:opacity-50 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 border border-black",
        secondary: "bg-white text-black border border-black hover:bg-black hover:text-white",
        outline: "bg-transparent text-white border border-white hover:bg-white hover:text-black",
        ghost: "bg-transparent text-black hover:bg-gray-100"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
