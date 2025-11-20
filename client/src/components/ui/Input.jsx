import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
