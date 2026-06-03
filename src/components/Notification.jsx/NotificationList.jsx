import React from 'react';
import { Bell } from 'lucide-react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { useNotificationLogic } from '@/hook/UseNotificationLogic';

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
        className="sidebar fixed right-0 -top-4 md:w-[33%] w-[80%] h-full bg-white shadow-lg p-6 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl  overflow-auto comment-scroll dark:bg-dark-post-background"
      >
        {/* هيدر القائمة */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="md:text-2xl text-xl font-bold dark:text-gray-50">{t('notification')}</h2>
            <Bell  className="md:text-2xl text-xl dark:text-gray-50" />
          </div>
        <button onClick={onClose} className=" absolute top-5 end-4 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-red-500 text-xl font-light hover:text-red-700 dark:text-red-700 " />
          </button>
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
