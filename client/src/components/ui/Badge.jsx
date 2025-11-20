import React from 'react';

const Badge = ({ status }) => {
  const styles = {
    Open: "bg-blue-50 text-blue-700 border-blue-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const defaultStyle = "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

export default Badge;
