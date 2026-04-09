import React from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { useNotificationLogic } from '@/hook/UseNotificationLogic';
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
// مصفوفة البيانات (يمكنك نقلها لملف constants لاحقاً إذا فضلت)
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    action: "followed you",
    time: "2h",
    is_read: false,
    notification_type:'follow',
    from_user:{
       username: "meriy",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
  {
    id: 2,
    action: "liked your post",
    time: "3h",
    is_read: true,
    target_type:'post',
    postImg:'https://i.pravatar.cc/150?u=1',
    notification_type:'follow',
     from_user:{
       username: "ritta",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
  {
    id: 3,
    action: "commented on your post",
    time: "5h",
    is_read: false,
    notification_type:'follow',
    target_type:'post',
    postImg:'https://i.pravatar.cc/150?u=1',
     from_user:{
       username: "sara",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
  {
    id: 4,
    action: "followed you",
    time: "1d",
    is_read: true,
    notification_type:'follow',
     from_user:{
       username: "john_doe",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
   {
    id: 5,
    action: "followed you",
    time: "2h",
    is_read: false,
    notification_type:'follow',
    from_user:{
       username: "meriy",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
   {
    id: 6,
    action: "followed you",
    time: "1d",
    is_read: true,
    notification_type:'follow',
    from_user:{
       username: "john_doe",
       personal_photo_url: "https://i.pravatar.cc/150?u=1",
    }
  },
];

const NotificationList = ({ isOpen,notifications, onClose,type }) => {
  const { t } = useTranslation();
  const { handleItemClick} = useNotificationLogic();

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} className="fixed inset-0 w-[800px] left-1/2" />

      {/* sidebar */}
      <motion.div
        key={type}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3 }}
        className="sidebar fixed right-0 top-0 w-[450px] h-[calc(100vh-64px)] bg-white shadow-lg p-6 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-scroll"
      >

        {/* هيدر القائمة */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold">{t('notification')}</h2>
            <Bell size={33} className="fill-white" />
          </div>
          <IoIosClose onClick={onClose} className="text-4xl text-red-600" />
        </div>

        {/* محتوى الإشعارات */}
        <div className="flex flex-col flex-1">
             {(notifications?.length> 0 ? notifications : NOTIFICATIONS_DATA).map((item) => (
             <div 
            key={item.id} 
            onClick={() => handleItemClick(item)}>
            <NotificationItem item={item}/>
          </div>
        ))}
      </div>
   
     </motion.div>
    
      
    </>
  );
};

export default NotificationList;