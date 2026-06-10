import React from 'react';
import { Bell } from 'lucide-react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { useNotificationLogic } from '@/hook/UseNotificationLogic';
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'; 
import { getNotificationsReq } from '@/api/NotificationApi';

const NotificationList = ({ isOpen, onClose, type }) => {
  const { t, i18n } = useTranslation();
 
  const isRTL = i18n.language === "ar";
  // ✅ مرر onClose لـ useNotificationLogic حتى يقدر يغلق الـ sidebar قبل الانتقال
  const { handleItemClick } = useNotificationLogic(onClose);

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsReq,
    enabled: isOpen,
  });

  const notifications = notificationsResponse?.data || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay الخلفية الداكنة مع أنميشن سلس للشفافية */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 w-[800px] start-1/2" // تم تصحيح الكلاسات ليكون خلفية حقيقية تغطي الشاشة
          />
          {/* overlay */}


          {/* sidebar */}
          <motion.div
            key={type}
            onClick={(e) => e.stopPropagation()}
            // 🌟 تعديل الأنميشن ليفتح من الجهة الصحيحة حسب اللغة
            initial={{ x: isRTL ? -400 : 400 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? -400 : 400 }}
            transition={{ type: "tween", duration: 0.2 }}
            // 🌟 تعديل الكلاس هنا ليتغير right-0 إلى left-0 في حال العربي لمنع تداخل القائمة مع المحتوى
            className={`sidebar fixed -top-6 md:-top-4  ${isRTL? "md:w-[33%]":"md:w-[30%]"}  dark:border border-gray-700 w-[80%] h-full bg-white shadow-lg p-6 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-auto comment-scroll dark:bg-dark-post-background ${isRTL ? 'start-0' : 'end-0'}`}
          >
            {/* هيدر القائمة */}
            {/* 🌟 تم إضافة md:space-x-reverse و space-x-reverse لقلب محاذاة النص والأيقونة في العربي */}
            <div className={`flex justify-between items-center mb-6 ${isRTL ? 'space-x-reverse md:space-x-reverse' : ''}`}>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <h2 className="md:text-2xl text-xl font-bold dark:text-gray-50">{t('notification')}</h2>
                <Bell  className="md:text-2xl text-xl dark:text-gray-50" />
              </div>
              
              {/* 🌟 تم تعديل تموضع زر الإغلاق ليتغير مكان الـ end-4 بشكل ديناميكي بناءً على الاتجاه ليطابق الـ سايد بانل تماماً */}
              <button 
                onClick={onClose} 
                className={`absolute top-5 p-2 z-10 hover:bg-gray-50 dark:hover:bg-black/20 rounded-full transition-colors ${isRTL ? 'end-4' : 'end-0'}`}
              >
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
      )}
    </AnimatePresence>
  );
};

export default NotificationList;