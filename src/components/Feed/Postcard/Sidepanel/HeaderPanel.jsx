import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
dayjs.extend(relativeTime);
const HeaderPanel = ({ user, createdAt, type,level }) => {
  const { i18n } = useTranslation();
const displayName = user?.user_username || user?.username; 
  // اختيار الصورة الصحيحة بناءً على ما هو متوفر
  const displayPhoto = user?.user_photo_url || user?.personal_photo_url;
  // ضبط اللغة بناءً على لغة التطبيق الحالية
  const locale = i18n.language === 'ar' ? 'ar' : 'en';
  dayjs.locale(locale);

  // تحويل التاريخ بصيغة "منذ..." (مثلاً: منذ ساعة، 2 hours ago)
  const formattedDate = createdAt ? dayjs(createdAt).fromNow() : ''; 
  return (
    
    <div className="flex items-center space-x-3 relative">
      <img src={displayPhoto} className="w-10 h-10 rounded-full" />
      <div className="text-md font-semibold capitalize dark:text-gray-50">
        {displayName}
      </div>
      {/* يظهر فقط بالتعليقات */}
      {type === "comments" && (
        <div className="text-sm text-gray-500 dark:text-gray-200">
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default HeaderPanel;