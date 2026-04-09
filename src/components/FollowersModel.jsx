// src/components/FollowersModal.jsx
import React from 'react';
import FollowerItem from './FollowerItem';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'; 
import { useTranslation } from 'react-i18next';
// يتطلب تثبيت heroicons: npm install @heroicons/react

const FollowersModal = ({ isOpen, onClose, followers }) => {
  // للتحكم بظهور وإخفاء البطاقة العائمة
  if (!isOpen) return null;
  const {t,i18n}=useTranslation();
  const isRtl =i18n.language==='ar';
  const {data:followers,isLoading,isError}=useGetFollowers(userId);
  return (
    // الخلفية المعتمة (Overlay)
    <div className="fixed inset-0  bacdrop-blur-[0.5px] z-50 flex items-center justify-center p-4" onClick={onClose}>

      <div 
        className="bg-main-background rounded-4xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 ease-out" 
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl':'ltr'} // لضمان اتجاه النص من اليمين
      >
        
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-main-text flex items-center gap-2 ml-3">
            followers <UserPlusIcon className="h-5 w-5 mr-2 ml-2 tranform translate-y-0.5 text-follow-button" />
            {t('followers')}
          </h2>
          {/* زر الإغلاق */}
         <button onClick={onClose} className='text-gray-400 hover:text-main-cancel-button transition'>
          <XMarkIcon className='h-6 w-6'/>
         </button>
        </div>
        <div className='overflow-y-auto max-h-96'>
          {
            isLoading && <p className='p-10 text-center text-sm'>
              {isRtl ? 'جاري التحميل ...' : 'Loading...'}
              </p>
          }
           {
            isError && <p className='p-10 text-center text-red-500 text-sm'>
              {isRtl ?"حدث خطأ في جلب البيانات " : 'Error loading data'}
              </p>
          }
       

        {/* جسم قائمة المتابعين */}
       
          {!isLoading && followers.length > 0 ? (
            followers.map(follower => (
              <FollowerItem
                key={follower.id}
                name={follower.name}
                avatar={follower.avatar}
              />
            ))
          ) : (
            <div className="p-10 text-center ">
              <p className='text-text-placeholder text-sm italic'>
             {isRtl ?' لا يوجد متابعون بعد.' :'No followers yet'}
            </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default FollowersModal;