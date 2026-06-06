import React, { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoNotifications } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import SearchDropdown from '../Search.jsx/SearchDropdown';
import NotificationModal from '../Notification.jsx/NotificationList';
import { useNotificationMutation } from '@/hook/UseNotificationMutation';
import { requestForToken } from '@/firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '@/hook/UseProfileData';
import { getUnreadCountReq } from '@/api/NotificationApi';

const Header = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { data: myProfile } = useGetProfile('me'); 
  const userPhoto = myProfile?.personal_photo_url || "/src/images/default-avatar.png";
  const { updateToken } = useNotificationMutation();
  const searchRef = useRef();
  
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: getUnreadCountReq,
  });

  useEffect(() => {
    if (updateToken && updateToken.mutate) {
      requestForToken(updateToken); 
    }
  }, [updateToken.mutate]);

  return (
    <header className="fixed bg-black dark:bg-gray-50 shadow-md top-0 left-0 right-0 z-[999] w-full h-fit md:h-fit flex items-center">
      {/* حاوية الهيدر الكاملة */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 md:gap-6" style={{ direction: 'ltr' }}>
        
        {/* 1. الشعار - يبقى ثابتاً في اليسار */}
        <div className="flex-shrink-0">
          <p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-title font-extrabold text-gradient tracking-tight cursor-pointer select-none" 
            onClick={() => navigate('/')}
          >
            DevConnect
          </p>
        </div>
      
        {/* 2. حاوية البحث - تم تصغيرها وجعلها متمركزة في المنتصف تماماً */}
        <div 
          ref={searchRef} 
          className="flex-grow flex justify-center mx-2 relative"
        >
          {/* هنا قمنا بتحديد حجم أصغر ومناسب (max-w-[180px] على الموبايل و max-w-[280px] على الشاشات الأكبر) */}
          <div className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px]">
            <SearchDropdown /> 
          </div>
        </div>

        {/* 3. الأيقونات والملف الشخصي - تبقى ثابتة في اليمين */}
        <div className="flex items-center gap-1 sm:gap-3 md:gap-4 flex-shrink-0">
          
          {/* أيقونة الإشعارات */}
          <div className="relative">
            <button 
              className="p-1.5 sm:p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-150"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <IoNotifications className="text-2xl md:text-3xl" />
              {unreadData?.data?.unread_count > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-black dark:border-white"></span>
              )}
            </button>
            
            <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
        
          {/* صورة الملف الشخصي */}
          <button
            onClick={() => navigate(`/profile/me`)}
            className="flex items-center p-0.5 rounded-full hover:scale-105 transition-transform shrink-0"
          >
            <img 
              src={userPhoto} 
              className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border border-gray-600 dark:border-gray-300" 
              alt="Profile"
            />
          </button>

          {/* أيقونة الإعدادات */}
          <button 
            onClick={() => navigate('/account')}
            className="p-1.5 sm:p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-150"
          >
            <MdSettings className="text-2xl md:text-3xl" />
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;