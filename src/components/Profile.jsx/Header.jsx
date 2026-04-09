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
  
  // استدعاء المنطق من الهوك المطور
 {/* const { 
    searchTerm, setSearchTerm, 
    activeTab, setActiveTab, 
    suggestions, 
    isDropdownOpen, setIsDropdownOpen,
    handleKeyDown, handleProfileClick 
  } = useSearch();*/}

  // تفعيل إغلاق القائمة عند النقر خارجها
 // useOnClickOutside(searchRef, () => setIsDropdownOpen(false));

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
            {/*
            <div className="relative">
             
               <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={t('search')}
            className="w-full py-2 pl-14 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 
            focus:ring-blue-500 bg-gray-100  text-lg font-semibld text-left placeholder-gray-700 dark:text-dark-text "
                style={{ direction: 'ltr' }}
          />
           <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-700"   />
           </div>

         
        {isDropdownOpen && (searchTerm.length > 0 || suggestions.length > 0) && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-post-background left-1/2 -translate-x-1/2
           w-[300px] sm:w-[450px] md:w-[600px] max-w-[90vw] shadow-2xl rounded-2xl border border-gray-100
            dark:border-gray-700 z-50 overflow-hidden">
            
          
            <div className="flex ">
              {['People', 'Tags', 'Posts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[15px] font-bold font-['Roboto]   ${
                    activeTab === tab 
                    ? 'text-blue-button border-b-2 border-blue-button bg-gray-50 dark:bg-white/5' 
                    : 'text-gray-400'
                  }`}
                >
                  {t(tab)}
                </button>
              ))}
            </div>

            
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                        if(activeTab === 'people') handleProfileClick(item.id);
                        else setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b
                     border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    {activeTab === 'people' ? (
                      <>
                        <img src={item.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div className="flex flex-col text-right w-full" dir="rtl">
                          <span className="text-sm font-bold dark:text-dark-text">{item.name}</span>
                          <span className="text-[10px] text-gray-500">{item.specialization}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-right w-full px-2" dir="rtl">
                        <span className="text-follow-button font-bold">#</span>
                        <span className="text-sm dark:text-dark-text">{item.name || item.text}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  {t('no_results_found')}
                </div>
                 
              )}
            </div>
          </div>
        )}*/}
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