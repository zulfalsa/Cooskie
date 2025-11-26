import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base";
  const variants = {
    primary: "bg-[#1e3a8a] text-white hover:bg-[#172554] shadow-md", 
    secondary: "bg-[#fffbeb] text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#fef3c7]",
    ghost: "text-[#1e3a8a] hover:bg-blue-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}