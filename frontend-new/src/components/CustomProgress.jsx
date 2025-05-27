import React from 'react';

const CustomProgress = ({ value, className }) => {
  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded ${className}`}>
      <div
        className="absolute top-0 left-0 h-full bg-green-600 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default CustomProgress; 