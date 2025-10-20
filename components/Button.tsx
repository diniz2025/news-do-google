
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'small';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'normal', className, ...props }) => {
  const baseClasses = "rounded-xl font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-800',
    secondary: 'bg-white text-slate-900 border border-gray-200 hover:bg-gray-100 focus:ring-slate-500',
  };

  const sizes = {
      normal: 'px-4 py-2 text-sm',
      small: 'px-3 py-1.5 text-xs',
  };

  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

export default Button;
