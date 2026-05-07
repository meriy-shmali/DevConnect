import React from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { useNotificationLogic } from '@/hook/UseNotificationLogic';
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'; 
import { getNotificationsReq } from '@/api/NotificationApi';

const NotificationList = ({ isOpen, onClose,type }) => {
  const { t } = useTranslation();
  const { handleItemClick} = useNotificationLogic();
  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsReq,
    enabled: isOpen, // لا يجلب البيانات إلا إذا كانت القائمة مفتوحة
  });

  // الوصول للمصفوفة (حسب axios غالباً تكون في response.data)
   const notifications = notificationsResponse?.data || [];

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
            {isLoading ? (
            <p className="text-center text-gray-500">{t('is_loading')}</p>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
              >
                <NotificationItem item={item} />
         </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-10">{t('no_notifications_yet')}</p>
          )}
        </div>
      </motion.div>
    
      
    </>
  );
};

export default NotificationList;