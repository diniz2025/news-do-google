
import React from 'react';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={`w-full min-h-[108px] border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-colors duration-150 ${className}`}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
