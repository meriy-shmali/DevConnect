// src/components/SearchResultItem.jsx
import React from 'react';

const SearchResultItem = ({ name, avatarUrl }) => {
  return (
    <div 
      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
      style={{ direction: 'rtl' }}
    >
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className="w-10 h-10 rounded-full object-cover ml-3"
      />
      <p className="text-gray-800 font-medium">{name}</p>
    </div>
  );
};

export default SearchResultItem;