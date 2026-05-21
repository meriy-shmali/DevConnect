import React, { useRef, useEffect,useState  } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoSearchOutline, IoSearchSharp ,IoPersonAddSharp } from 'react-icons/io5';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchDropdown from '../Search.jsx/SearchDropdown';
import { IoNotifications } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import NotificationModal from '../Notification.jsx/NotificationList';
import { useNotificationMutation } from '@/hook/UseNotificationMutation';
import { Bell } from 'lucide-react';
import { getUnreadCountReq } from '@/api/NotificationApi';
import { requestForToken } from '@/firebase/firebaseConfig';
import { useNavigate } from 'react-router';
import { useGetProfile } from '@/hook/UseProfileData';

const Header = () => {
  const navigate = useNavigate();
  const [isNotifOpen,setIsNotifOpen]=useState(false);
  const { data: myProfile } = useGetProfile('me'); 
  const userPhoto = myProfile?.personal_photo_url || "/src/images/default-avatar.png";
  const {updateToken} =useNotificationMutation();
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
    <header className="bg-black dark:bg-gray-50 shadow-lg border-b border-gray-200 sticky top-0 z-30 w-full ">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" style={{ direction: 'ltr' }}>
        
         {/* 1. شعار التطبيق - DevConnect */}
        <div className="flex items-center ">
         <p className='md:text-[48px] text-[30px] font-bold text-gradient'>DevConnect</p>
        </div>
      
      {/* منطقة البحث المحدثة */}
     <div ref={searchRef} className="flex-grow flex justify-center mx-4 md:max-4 relative">
          <div className=" w-full md:max-w-sm  ">
            <SearchDropdown/> 
      </div>
       </div>

        {/* 3. أيقونات الإشعارات والملف الشخصي */}
        <div className="flex items-center md:gap-x-4">
          
         {/* أيقونة الإشعارات */}
          <button 
            className="p-2 rounded-full  text-gray-300 dark:text-gray-700 relative transition duration-150"
             onClick={()=>setIsNotifOpen(!isNotifOpen)}
          >
             <IoNotifications className='md:w-8 md:h-8 w-7 h-7 '/>
                {unreadData?.data?.unread_count > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-black"></span>
                )}
            </button>
           <NotificationModal isOpen={isNotifOpen} onClose={()=>setIsNotifOpen(false)}/>
           
                  {unreadData?.data?.unread_count > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                 
                  </span>
              )}
        
           {/* أيقونة الملف الشخصي - تستخدم الصورة الافتراضية */}
          <button
            onClick={()=>navigate(`/profile/me`)}
            className="flex items-center p-0.5 rounded-full">
               <img 
         src={userPhoto } 
         className="md:h-9 md:w-9 w-7 h-7 rounded-full object-cover" 
         alt="Profile"
       />
          </button>
          <button 
            onClick={()=>navigate('/account')}
            className='p-2 rounded-full  text-gray-300 dark:text-gray-700 transition duration-150'>
            <MdSettings className='md:h-9 md:w-9 w-7 h-7'/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;