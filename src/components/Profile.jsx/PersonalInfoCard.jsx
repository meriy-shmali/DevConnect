import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import EditProfileModal from './EditProfileModel';
import { useParams } from 'react-router';
import { useIsOwner } from '@/hook/UseIsOwner';
import { useGetProfile} from '@/hook/useProfileData';
const PersonalInfoCard = ({ info ,  userData}) => {
  const { username}=useParams();
  const { t } = useTranslation();
const { id } = useParams();
   const profileTarget = id || 'me';
      const { data: profile, isLoading } = useGetProfile(profileTarget);
     const isOwner = profileTarget === 'me' || String(profile?.id) === String(localStorage.getItem('userId'));
  const [isModalOpen,setIsModalOpen]=useState(false);
  
  return (
    <div className="mx-4 md:mx-auto max-w-full border border-gray-300 rounded-[35px] p-8 relative bg-white shadow-sm my-10 rtl text-right dark:bg-dark-post-background">
    <div className='flex flex-row-reverse items-center justify-between mb-6 md:mb-10'>
     {isOwner && (
      <button 
       variant='secondary'
       type='edit'
       size='sm'
       onClick={()=>setIsModalOpen(true)}
       className="absolute top-6 end-6 flex items-center gap-2 px-2 py-2 md:px-3 md:py-1  bg-blue-button text-text-button md:text-[18px] hover:bg-hover-blue rounded-lg dark:text-gray-50">
        {t('edit')} 
        <MdEdit className='md:size-[18px]' />
      </button>
      )} 
      <h3 className="md:text-center text-left font-bold flex-1 md:text-2xl text-xl dark:text-gray-50">{t('personal_info')}</h3></div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <span className="font-medium md:text-xl text-xl text-start w-36 md:w-42 shrink-0 dark:text-gray-50">{t('specialization')} :</span>
          <p className="text-gray-700 text-start md:text-lg break-words dark:text-gray-50">{info?.specialization ? info.specialization :"" }</p>
        </div>

        <div className="flex items-start gap-4">
          <span className="font-medium md:text-xl text-xl text-start w-36 md:w-42 shrink-0 dark:text-gray-50">{t('bio')} :</span>
          <p className="text-gray-700 text-start md:text-lg break-words dark:text-gray-50">{info?.bio ? info.bio :""}</p>
        </div>
       
        <div className="flex items-start gap-4">
          <span className="font-medium md:text-xl text-lg text-start w-36 md:w-42 shrink-0 dark:text-gray-50">{t('links')} :</span>
          <div className="text-gray-700 text-start md:text-xl break-all whtespace-normal flex-1 dark:text-gray-50">
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