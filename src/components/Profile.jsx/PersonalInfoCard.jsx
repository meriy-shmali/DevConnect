import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import EditProfileModal from './EditProfileModel';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
const PersonalInfoCard = ({ info ,  userData}) => {
  
  const { t } = useTranslation();
const { id } = useParams();

  
  // 2. جلب بيانات المستخدم المسجّل حالياً من الـ Auth Context
  const { currentUser } = useAuth();

  // 3. التحقق الذكي من المالك:
  // - إما أن يكون الرابط هو 'me' أو غير موجود (صفحتكِ الشخصية)
  // - أو أن يتطابق الـ id الموجود في الرابط مع الـ id الخاص بالمستخدِم الحالي المسجل في النظام
  const isOwner = 
    id === 'me' || 
    !id || 
    String(id) === String(currentUser?.id || currentUser?.uid);
  const [isModalOpen,setIsModalOpen]=useState(false);
  
  return (
    <div className="mx-4 md:mx-auto max-w-full border border-gray-300 rounded-[35px] p-8 relative bg-white shadow-sm my-10 rtl text-right dark:bg-dark-post-background">
    <div className='flex flex-row-reverse items-center justify-between mb-8 md:mb-10'>
      
  <div>  {isOwner && (
      <button 
       variant='secondary'
       type='edit'
       size='sm'
       onClick={()=>setIsModalOpen(true)}
       className="absolute top-7 end-6 flex items-center gap-1 px-1.5 py-1.5 md:px-3 md:py-1  bg-blue-button text-text-button md:text-[16px] text-[13px] hover:bg-hover-blue rounded-md dark:text-gray-50">
        {t('edit')} 
        <MdEdit className='md:size-[16px] size-[13px]' />
      </button>
      )} </div> 
    <div>  <h3 className="md:text-center text-left font-bold flex-1 md:text-2xl text-xl dark:text-gray-50">{t('personal_info')}</h3></div></div>
      <div className="space-y-5">
        <div className="flex items-baseline gap-2">
          <span className="font-medium md:text-xl text-lg text-start w-32 md:w-42 shrink-0 dark:text-gray-50">{t('specialization')} :</span>
          <p className="text-gray-700 text-start flex-1 md:text-lg text-sm break-words dark:text-gray-50">{info?.specialization ? info.specialization :"" }</p>
        </div>

        <div className="flex items-baseline gap-2 ">
          <span className="font-medium md:text-xl text-lg text-start w-32 md:w-42 shrink-0 dark:text-gray-50">{t('bio')} :</span>
          <p className="text-gray-700 flex-1 text-start md:text-lg text-sm  break-words dark:text-gray-50">{info?.bio ? info.bio :""}</p>
        </div>
       
        <div className="flex items-baseline gap-2">
          <span className="font-medium md:text-xl text-lg text-start w-32 md:w-42 shrink-0 dark:text-gray-50">{t('links')} :</span>
          <div className="text-gray-700 text-start md:text-lg text-sm break-all whtespace-normal flex-1 dark:text-gray-50">
           {info?.links && typeof info.links === 'string' ? (
           <p>{info.links}</p>
            ) : 
            Array.isArray(info?.links) && info.links.length > 0 ? (
            info.links.map((link, i) => (
              <a key={i}className="text-blue-500 hover:underline">{link.label}</a>
            ))
           ) : (null
           )}
          </div>
        </div>
      </div>
   
    <EditProfileModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} initialData={info}/>
     </div>
  );
};
export default PersonalInfoCard;