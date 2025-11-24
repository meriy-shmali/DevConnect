// src/components/PostCard.jsx
import React from 'react';
import {
  IoHeartOutline,
  IoHeartSharp,
  IoChatbubbleOutline,
  IoShareOutline,
  IoBookmarkOutline,
  IoBookmarkSharp,
} from 'react-icons/io5';

const PostCard = () => {
  // يمكن استخدام state لإدارة حالة الإعجاب والحفظ
  const isLiked = false;
  const isSaved = false;

  // Icons في الصورة (يمكن استبدالها بأيقونات أخرى لتطبيق أفضل)
  const viewsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl mx-auto border border-gray-200" style={{ direction: 'rtl' }}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 space-x-reverse">
          <img
            src="/avatars/rita.jpg"
            alt="Ritta7 avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-lg text-gray-800">Ritta7</p>
            <p className="text-sm text-gray-400">التاريخ</p>
          </div>
        </div>
        
        {/* زر التصنيف */}
        <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition">
          التصنيف
        </button>
      </div>

      {/* محتوى المنشور */}
      <div className="py-6">
        <p className="text-lg text-gray-700">منشور نصي ينزلو المستخدم</p>
        {/*  */}
      </div>

      {/* أزرار التفاعل والإحصائيات */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6 space-x-reverse text-gray-500">
          
          {/* إعجاب */}
          <div className="flex items-center space-x-1 space-x-reverse cursor-pointer hover:text-red-500 transition">
            {isLiked ? <IoHeartSharp className="w-6 h-6 text-red-500" /> : <IoHeartOutline className="w-6 h-6" />}
            <span className="text-sm">1k</span>
          </div>

          {/* مشاهدات/تفاعل (أيقونة العين في الصورة) */}
          <div className="flex items-center space-x-1 space-x-reverse">
            {viewsIcon}
            <span className="text-sm">1k</span>
          </div>

          {/* تعليقات */}
          <div className="flex items-center space-x-1 space-x-reverse cursor-pointer hover:text-indigo-600 transition">
            <IoChatbubbleOutline className="w-6 h-6" />
            <span className="text-sm">20</span>
          </div>

          {/* مشاركة (أيقونة السهم في الصورة) - تم استخدام أيقونة Share */}
          <div className="flex items-center space-x-1 space-x-reverse cursor-pointer hover:text-green-500 transition">
            <IoShareOutline className="w-6 h-6" />
            <span className="text-sm">3</span>
          </div>

          {/* حفظ (أيقونة المرجع في الصورة) - تم استخدام أيقونة Bookmark */}
          <div className="flex items-center space-x-1 space-x-reverse cursor-pointer hover:text-yellow-500 transition">
            {isSaved ? <IoBookmarkSharp className="w-6 h-6 text-yellow-500" /> : <IoBookmarkOutline className="w-6 h-6" />}
            <span className="text-sm">3</span>
          </div>
        </div>
      </div>
      
      {/* منطقة إضافة التعليق */}
      <div className="mt-4 flex items-center space-x-3 space-x-reverse">
        <img
          src="/avatars/user.jpg" // صورة المستخدم الحالي
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover"
          />
        <input
          type="text"
          placeholder="Add comment"
          className="flex-grow py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right placeholder-gray-500"
        />
        <button className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-150">
          post
        </button>
      </div>
    </div>
  );
};

export default PostCard;