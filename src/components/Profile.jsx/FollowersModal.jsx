import React from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const FollowersModal = ({ isOpen, onClose, followers, isLoading, error }) => {
  const { t } = useTranslation();
  const navigate=useNavigate();
  const listData = Array.isArray(followers) ? followers : (followers?.results || followers?.data || []);
  const handleUserClick = (user_id) => {
    navigate(`/profile/${user_id}`); // 3. المسار الخاص ببروفايل المستخدم
    onClose(); // إغلاق المودال بعد الانتقال
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all duration-300 cursor-pointer" onClick={onClose}>
      
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 cursor-default" onClick={(e)=>e.stopPropagation()}>
        
        {/* Header */}
        <div className=" relative flex items-center shrink-0 p-4 ml-3">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-medium text-gray-900  tracking-tight p-4">{t('followers')}</h2>
            <Users className="w-7 h-7 " />
          </div>
          <button onClick={onClose} className=" absolute top-5 right-5 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6  text-red-500 text-xl font-light hover:text-red-700 " />
          </button>
        </div>

        {/* List Content */}
        <div className="max-h-[50vh] md:max-h-[52vh] lg:max-h-[58vh] custom-scrollbar flex-1 overflow-y-auto p-4 ml-3 pr-6 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading followers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-sm">
              حدث خطأ أثناء جلب البيانات.
            </div>
          ) : (listData.length > 0 ? (
               listData.map((user) => (
              <div
               key={user.id} 
               onClick={()=>handleUserClick(user.id)}
               className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all
                group cursor-pointer border border-transparent hover:border-gray-200">
                <img 
                  src={user.personal_photo_url || "/src/images/default-avatar.png"} 
                  className="w-12 h-12 rounded-full border border-gray-100 object-cover" 
                  alt={user.username}
                />
                <span className="font-medium  text-xl flex-1">{user.username}</span>
               
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-400 italic">{t('no_followers_yet')}</p>
          ))}
        </div>
      </div>
    </div>
);
};

export default FollowersModal;