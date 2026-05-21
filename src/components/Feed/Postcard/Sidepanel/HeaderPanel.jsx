import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
const HeaderPanel = ({ user, createdAt, type,level }) => {
  const { i18n } = useTranslation();
const displayName = user?.user_username || user?.username; 
  // اختيار الصورة الصحيحة بناءً على ما هو متوفر
  const displayPhoto = user?.user_photo_url || user?.personal_photo_url;
  // ضبط اللغة بناءً على لغة التطبيق الحالية
const getCommentDate = (date) => {
    if (!date) return '';
    const locale = i18n.language === 'ar' ? 'ar' : 'en';

    // نستخدم fromNow(true) للحصول على النص بدون "منذ" أو "ago"
    let timeStr = dayjs(date).locale(locale).fromNow(true);

    // استبدال يدوي للمصطلحات لضمان الاختصار دون التأثير على باقي الموقع
    if (locale === 'ar') {
      return timeStr
        .replace('ثواني', '1ث').replace('دقيقة واحدة', '1د').replace('دقائق', 'د')
        .replace('ساعة واحدة', '1سا').replace('ساعات', 'سا').replace('يوم واحد', '1ي')
        .replace('أيام', 'ي').replace('شهر واحد', '1ش').replace('أشهر', 'ش')
        .replace('عام واحد', '1سن').replace('أعوام', 'سن');
    } else {
      return timeStr
        .replace('a few seconds', '1s').replace('a minute', '1m').replace('minutes', 'm')
        .replace('an hour', '1h').replace('hours', 'h').replace('a day', '1d')
        .replace('days', 'd').replace('a month', '1mo').replace('months', 'mo')
        .replace('a year', '1y').replace('years', 'y').replace(' ', '');
    }
  };

  const formattedDate = getCommentDate(createdAt);

  return (
    
    <div className="flex items-center space-x-3 relative">
      <img src={displayPhoto} className="w-10 h-10 rounded-full" />
      <div className="text-md font-semibold capitalize dark:text-gray-50">
        {displayName}
      </div>
      {/* يظهر فقط بالتعليقات */}
      {type === "comments" && (
        <div className="text-xs text-gray-500 dark:text-gray-200">
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default HeaderPanel;