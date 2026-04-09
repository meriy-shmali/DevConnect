import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MdEdit } from 'react-icons/md';
import EditProfileModal from './EditProfileModel';
import { useParams } from 'react-router';
import { string } from 'zod';
const PersonalInfoCard = ({ info , userIdFromApi}) => {
  const { username}=useParams();
  const { t } = useTranslation();
  const currentUserId = localStorage.getItem('userId');
  const currentUsername = localStorage.getItem('username');
  const infoId = info?.id || info?.data?.id||info?.info?.id;
 // const isOwner =  currentUserId && userIdFromApi && string(currentUserId) && string(userIdFromApi)===string(userIdFromApi)
  const isOwner = currentUsername 
  console.log('Debug',{fromLocalStorage:currentUserId,fromProps:userIdFromApi,match: isOwner})
  const [isModalOpen,setIsModalOpen]=useState(false);
  return (
    <div className="mx-4 md:mx-auto max-w-5xl border border-gray-300 rounded-[35px] p-8 relative bg-white shadow-sm my-10 rtl text-right">
    <div className='flex flex-row-reverse items-center justify-between mb-6 md:mb-10'>
     {isOwner && (
      <button 
       variant='secondary'
       type='edit'
       size='sm'
       onClick={()=>setIsModalOpen(true)}
       className="absolute top-6 right-8 flex items-center gap-2 px-3 py-2 md:px-3 md:py-1  bg-blue-button text-text-button md:text-[24px] hover:bg-hover-purple rounded-lg">
        {t('edit')} 
        <MdEdit className='size-[22px]' />
      </button>
      )} 
      <h3 className="md:text-center text-left font-bold flex-1 md:text-3xl text-2xl">{t('personal_info')}</h3></div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <span className="font-medium md:text-2xl text-xl text-start w-36 md:w-42 shrink-0">{t('specialization')} :</span>
          <p className="text-gray-700 text-start md:text-xl break-words">{info?.specialization ? info.specialization :"" }</p>
        </div>

        <div className="flex items-start gap-4">
          <span className="font-medium md:text-2xl text-xl text-start w-36 md:w-42 shrink-0">{t('bio')} :</span>
          <p className="text-gray-700 text-start md:text-xl break-words">{info?.bio ? info.bio :""}</p>
        </div>
       
        <div className="flex items-start gap-4">
          <span className="font-medium md:text-2xl text-xl text-start w-36 md:w-42 shrink-0">{t('links')} :</span>
          <div className="text-gray-700 text-start md:text-xl break-words">
            {info?.links && info.links.length>0 ? ( info.links.map ((link,i)=>(
              <a key={i} href={link.url} className="text-blue-500 hover:underline">{link.label}</a>
            ))):null}
          </div>
        </div>
      </div>
   
    <EditProfileModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} initialData={info}/>
     </div>
  );
};
export default PersonalInfoCard;