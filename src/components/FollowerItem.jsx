// src/components/FollowerItem.jsx
import React from 'react';

const FollowerItem = ({ name, avatar }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out border-b border-gray-100 last:border-b-0">
      <div className="flex items-center ">
        {/* صورة الملف الشخصي */}
        <img
          className="w-10 h-10 rounded-full object-cover ml-6 mr-3 border border-gray-100"
          src={avatar || '/default-avatar.png'}
          alt={`${name}'s avatar`}
        />
        
        {/* اسم المتابع */}
        <span className="text-sm font-semibold text-main-text">{name}</span>
      </div>
      
      {/* زر المتابعة/الإزالة (اختياري، بناءً على حالة المستخدم الحالي) */}
     
      <button className="text-xs text-follow-button font-bold hover:bg-follow-button/10 px-3 py-1 rounded-full transition">
        Following
      </button>
     
    </div>
  );
};

export default FollowerItem;