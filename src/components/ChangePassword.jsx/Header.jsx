import React, {  useRef } from 'react';
import { IoSearchOutline, IoSearchSharp ,IoPersonAddSharp, IoSettingsSharp } from 'react-icons/io5';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
//import { useTranslation } from "react-i18next";
//import { useSearch } from '@/hook/UseSearch';
import SearchDropdown from '../Search.jsx/SearchDropdown';
//import { useOnClickOutside } from '@/hook/useOnClickOutside';


const Header = ({ onNotificationClick }) => {
  const NO_AVATAR = 'NO_AVATAR'; 
const userAvatar='./public/images/login.jpg';
//const userHasAvatar=userAvatar !== NO_AVATAR;
const renderAvatar=(avatarUrl,sizeClass)=>{
  if (avatarUrl===NO_AVATAR){return(<IoPersonAddSharp className={`${sizeClass} text-gray-400`}/>);
  }
return(<img className={`${sizeClass} rounded-full object-cover`} src={avatarUrl}/>)}
  // const { t } = useTranslation();
  const searchRef = useRef();
  return (
    <header className="bg-black shadow-lg shadow-2xl border-b border-gray-200 sticky top-0 z-30 ">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
       style={{ direction: 'ltr' }}>
        
        {/* 1. شعار التطبيق - DevConnect */}
        <div className="flex items-center ">
         <p className='text-[48px] font-bold text-gradient'>DevConnect</p>
        </div>
      
      {/* منطقة البحث المحدثة */}
     <div ref={searchRef} className="flex-grow flex justify-center mx-4 md:max-4 relative">
          <div className=" w-full md:max-w-sm  ">
            <SearchDropdown/> 
      </div>
       </div>

        {/* 3. أيقونات الإشعارات والملف الشخصي */}
        {/* تم عكس الترتيب (Reverse) لـ space-x لضمان أن العناصر تظهر بالترتيب الصحيح (من اليسار لليمين: الإشعارات، الأفاتار) */}
        <div className="flex items-center space-x-2 space-x-reverse">
          
          {/* أيقونة الإشعارات */}
          <button 
            className="p-2 rounded-full hover:bg-gray-800 text-gray-300 relative transition duration-150"
            onClick={onNotificationClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-black"></span>
          </button>
          
          {/* أيقونة الملف الشخصي - تستخدم الصورة الافتراضية */}
          <button className="flex items-center p-0.5 rounded-full hover:bg-gray-800">
            {renderAvatar(userAvatar,'h-8 w-8')}
          </button>
          <button className='p-2 rounded-full hover:bg-gray-800 text-gray-300 transition duration-150'>
            <IoSettingsSharp className='h-6 w-6'/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;