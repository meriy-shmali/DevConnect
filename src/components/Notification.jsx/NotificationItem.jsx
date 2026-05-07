import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale'; 
import { useTranslation } from 'react-i18next';

const NotificationItem = ({ item , onClick }) => {
  const { t, i18n } = useTranslation();
   const getRelativeTime = (dateString) => {
    if (!dateString) return "";

    // تحديد الـ Locale المناسب بناءً على لغة i18next الحالية
    const currentLocale = i18n.language === 'ar' ? ar : enUS;

    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true, // يضيف كلمة "منذ" أو "ago" تلقائياً
        locale: currentLocale, // هنا يتم تحديد اللغة برمجياً
      });
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "";
    }
  };

  // حماية: إذا لم تتوفر بيانات العنصر لا ترسم شيئاً
  if (!item) return null;

  return (
    <div 
     onClick={onClick}
     className={`flex items-center justify-between p-4  transition-colors border-b border-gray-50
     last:border-0 cursor-pointer group ml-4 ${item.is_read ? 'bg-white hover:bg-gray-50':'bg-gray-200/80'}`}>
      <div className="flex items-center gap-3">
        {/* الصورة الشخصية (Avatar) */}
        <div className="relative flex-shrink-0 mr-2">
          <img 
            src={item?.from_user?.personal_photo_url || "/default-avatar.png"} 
            className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" 
            alt="user"
          />
         
        </div>
        
        {/* نصوص الإشعار */}
        <div className="flex flex-col gap-0.5">
          <p className='text-[18px] leading-snug text-black mb-2  '>
            <span className={` mr-1 ${item.is_read ?' text-2xl':'!font-bold'}` }>{item?.from_user?.username}</span> 
            {" "}
            <span className={` ${item.is_read ?'':'!font-bold'}`}> {t(`notifications_msg.${item?.notification_type}`)}</span>
          </p>
          <span className={`text-[16px] text-gray-600 font-medium ${item.is_read ? '!text-black':'text-gray-600'}`}>
              {getRelativeTime(item?.created_at)} 
          </span>
        </div>
      </div>

      {/* صورة المنشور المصغرة - تظهر فقط إذا كان الإشعار تفاعل على بوست */}
      {item?.notification_type  && item?.post_image && (
        <div className="flex-shrink-0 ml-2">
          <img 
            src={ item.post_image} 
            className="w-10 h-10 rounded-lg object-cover border border-gray-200 group-hover:opacity-100 opacity-80 transition-opacity" 
            alt="post content" 
          />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;