import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-100 shadow-sm p-6 transition-all duration-300 ${hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-violet-100' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
