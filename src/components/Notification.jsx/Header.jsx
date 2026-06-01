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
    <header className="fixed bg-black dark:bg-gray-50 shadow-md border-b border-gray-200 top-0 left-0 right-0 z-[999] w-full">
      {/* 1. تم تعديل الحاوية إلى max-w-full لتمتد العناصر إلى الحواف والزوايا تماماً */}
      <div className="max-w-full mx-auto px-4 sm:px-8 h-fit flex items-center justify-between gap-4 md:gap-8" style={{ direction: 'ltr' }}>
        
        {/* 1. شعار التطبيق - صار بارزاً ومموضعاً بالزاوية اليسرى */}
        <div className="flex-shrink-0">
          {/* تم تكبير الخط هنا ليصبح text-3xl (يعادل 30px) وللشاشات الأكبر text-4xl ليظهر بشكل ممتاز وقوي */}
          <p className="text-2xl sm:text-3xl lg:text-4xl font-title font-extrabold text-gradient tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            DevConnect
          </p>
        </div>
      
        
        <div ref={searchRef} className="flex-grow max-w-xs md:max-w-md mx-2  relative md:left-20">
          <div className="w-fit ">
            <SearchDropdown /> 
          </div>
        </div>

        {/* 3. الأيقونات والملف الشخصي - مموضعة بالزاوية اليمنى تماماً */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-shrink-0">
          
          {/* أيقونة الإشعارات */}
          <div className="relative">
            <button 
              className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-150"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              {/* حجم أيقونات مريح ومتناسق مع الشعار الكبير */}
              <IoNotifications className="text-2xl md:text-3xl" />
              {unreadData?.data?.unread_count > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-black dark:border-white"></span>
              )}
            </button>
            
            <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
        
          {/* أيقونة الملف الشخصي */}
          <button
            onClick={() => navigate(`/profile/me`)}
            className="flex items-center p-0.5 rounded-full hover:scale-105 transition-transform"
          >
            <img 
              src={userPhoto} 
              className="h-8 w-8 md:h-8 md:w-8 rounded-full object-cover border border-gray-600 dark:border-gray-300" 
              alt="Profile"
            />
          </button>

          {/* أيقونة الإعدادات */}
          <button 
            onClick={() => navigate('/account')}
            className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-150"
          >
            <MdSettings className="text-2xl md:text-3xl" />
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;