
import React from 'react';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => {
  return (
    <label
      {...props}
      className={`block text-sm font-semibold mb-1.5 text-slate-700 ${className}`}
    />
  );
};

export default Label;
