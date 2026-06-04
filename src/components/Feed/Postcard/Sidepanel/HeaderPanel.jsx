import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HeaderPanel = ({ user, createdAt, type, level, currentUserId }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const userId = user?.user_id || user?.id;

  const profilePath = userId
    ? Number(userId) === Number(currentUserId)
      ? '/profile/me'
      : `/profile/${userId}`
    : null;

  const displayName = user?.user_username || user?.username; 
  const displayPhoto = user?.user_photo_url || user?.personal_photo_url || "/images/default-avatar.png";

  const getCommentDate = (date) => {
    if (!date) return '';
    const locale = i18n.language === 'ar' ? 'ar' : 'en';
    let timeStr = dayjs(date).locale(locale).fromNow(true);

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
    // 💡 إزالة space-x واعتماد gap لمنع مشاكل قلب اللغات
    <div className="flex items-start gap-3 relative w-full">
      <img
        src={displayPhoto}
        className="md:w-9 md:h-9 h-8 w-8 rounded-full cursor-pointer flex-shrink-0 object-cover"
        onClick={() => profilePath && navigate(profilePath)}
        alt="avatar"
      />
      {/* 🌟 تجميع الاسم والتاريخ في حاوية مرنة موازية للنص بالأسفل */}
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <div
          className="md:text-md text-[14px] capitalize font-semibold dark:text-gray-50 cursor-pointer truncate"
          onClick={() => profilePath && navigate(profilePath)}
        >
          {displayName}
        </div>
        {type === "comments" && (
          <div className="text-xs text-gray-400 dark:text-gray-300 flex-shrink-0 pt-0.5">
            • {formattedDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPanel;