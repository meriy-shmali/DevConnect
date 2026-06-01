import React from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { useNotificationLogic } from '@/hook/UseNotificationLogic';
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'; 
import { getNotificationsReq } from '@/api/NotificationApi';

const NotificationList = ({ isOpen, onClose, type }) => {
  const { t } = useTranslation();

  // ✅ مرر onClose لـ useNotificationLogic حتى يقدر يغلق الـ sidebar قبل الانتقال
  const { handleItemClick } = useNotificationLogic(onClose);

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsReq,
    enabled: isOpen,
  });

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
        className="sidebar fixed right-0 top-0 md:w-[450px] w-[350px] h-[calc(100vh-64px)] bg-white shadow-lg p-6 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-scroll dark:bg-dark-post-background"
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
              // ✅ onClick يمرر للـ NotificationItem مباشرة
              <NotificationItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
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
