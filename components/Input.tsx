
import React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        className={`w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-colors duration-150 ${className}`}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
