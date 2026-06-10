import React from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FollowersModal = ({ isOpen, onClose, followers, isLoading, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const listData = Array.isArray(followers) ? followers : (followers?.results || followers?.data || []);

  let myRealId = null;
  const token = localStorage.getItem("access");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      myRealId = payload.user_id || payload.id;
    } catch (e) {
      console.error("Error decoding token in modal", e);
    }
  }

  const handleUserClick = (targetUserId) => {
    if (!targetUserId) return;

    if (myRealId && String(targetUserId) === String(myRealId)) {
      navigate('/profile/me');
    } else {
      navigate(`/profile/${targetUserId}`);
    } 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all duration-300 cursor-pointer" onClick={onClose}>
      <div 
        className="bg-white relative top-5 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 cursor-default dark:bg-dark-post-background" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="-mb-4 relative flex items-center justify-start shrink-0 p-4">
          <div className="flex items-center gap-2 dark:text-gray-50">
            <h2 className="text-3xl font-medium tracking-tight p-4 dark:text-gray-50">{t('followers')}</h2>
            <Users className="w-7 h-7" />
          </div>
          <button onClick={onClose} className="absolute top-5 end-4 p-2 z-10 hover:bg-gray-50 dark:hover:bg-black/20 rounded-full transition-colors">
            <X className="w-5 h-5 text-red-500 text-xl font-light hover:text-red-700 dark:text-red-700" />
          </button>
        </div>

        {/* List Content */}
        {/* أضفنا منع انتشار الحدث هنا لضمان استقرار المودال عند التعامل مع العناصر الفرعية وحالات التحميل */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="max-h-[50vh] md:max-h-[52vh] lg:max-h-[58vh] custom-scrollbar overflow-y-auto preview-scroll p-4 ml-3 pr-6 space-y-3"
        >
          {isLoading ? (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">{t('loading_followers')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-sm">
              {t('error_fetching_data')}
            </div>
          ) : (listData.length > 0 ? (
            listData.map((item) => {
              const userDetail = item?.follower || item?.follower_user || item?.user || item?.sender || item;
              const extractedId = userDetail?.id || item?.follower_id || item?.id;

              return (
                <div
                  key={extractedId} 
                  onClick={() => handleUserClick(extractedId)}
                  className="flex items-center gap-8 p-2 hover:bg-gray-50  dark:hover:bg-gray-100/20 dark:border-none rounded-xl transition-all group cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <img 
                    src={userDetail?.personal_photo_url || "/default.jpg"} 
                    className="w-12 h-12 rounded-full border border-gray-100 object-cover" 
                    alt={userDetail?.username || "user"}
                  />
                  <span className="font-medium text-xl dark:text-gray-50">{userDetail?.username || item?.username}</span>
                </div>
              );
            })
          ) : (
            <p className="text-center py-10 text-gray-400 italic dark:text-gray-50">{t('no_followers_yet')}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;