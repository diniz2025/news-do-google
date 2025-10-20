
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`border border-gray-200 rounded-2xl bg-white shadow-sm ${className}`}>
      {title && (
        <div className="border-b border-gray-200 p-4">
          <strong className="text-base font-semibold">{title}</strong>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
