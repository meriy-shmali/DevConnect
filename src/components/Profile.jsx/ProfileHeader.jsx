import React, { useState, useRef } from 'react';
import { UserPlus, Users, Edit2,Pencil,Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { useIsOwner } from '@/hook/UseIsOwner';
import { useUpdatePersonalInfo } from '@/hook/UseProfileData';
import { useGetFollowers } from '@/hook/UseGetFollowers';
import { useGetFollowing } from '@/hook/UseGetFollowing';
import { MdEdit } from 'react-icons/md';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import { followUser } from '@/api/FollowersApi';
import AiModal from './AiModal';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useUpdateProfilePhoto,useDeleteProfilePhoto } from '@/hook/UseUpdateProfileMutation';
import { useFollow } from '@/hook/UseFollow';
const ProfileHeader = ({ userData }) => {

  const { t } = useTranslation();
  const { followMutation, unfollowMutation } = useFollow(); 
  const [menu, setMenu] = useState({});
  const [showEditMenu,setShowEditMenu]=useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [ModalOpen, setModalOpen] = useState(null);
  const { data: followers } = useGetFollowers(userData?.id); 
  const { data: following } = useGetFollowing(userData?.id);
  const fileInputRef = useRef(null);
  const { username } = useParams();
  const deleteMutation = useDeleteProfilePhoto();
  //const isOwner = true;
  const isOwner = username === 'me' || String(userData?.id) === String(localStorage.getItem('userId'));
  const handleEditClick = () => {
    setShowEditMenu(false);
    fileInputRef.current.click();
  };

  const [ showUnfollowModal,setShowUnfollowModal] = useState(false);
  const handleFollowClick = () => {
  if (userData?.is_following|| userData?.data?.is_following) { // تأكدي من مسمى الحقل القادم من الباك إند
    setShowUnfollowModal(true);
  } else {
    // نستخدم followMutation المستخرج من الهوك
    followMutation.mutate(userData?.id || userData?.data?.id);
  }
};

 const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('personal_photo', file); 
    
    try {
      setIsUploading(true);
      // استخدمي mutateAsync بدلاً من mutate لكي يعمل الـ await والـ try/catch
      await updateMutation.mutateAsync(formData); 
      console.log("تم الإرسال للشبكة بنجاح");
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
    } finally {
      setIsUploading(false);
    }
  }
};

const updateMutation = useUpdateProfilePhoto();
const handleDeletePhoto = async () => {
  const confirmDelete = window.confirm("هل أنتِ متأكدة من حذف الصورة الشخصية؟");
  
  if (confirmDelete) {
    try {
      setIsUploading(true);
      setShowEditMenu(false); 
      await deleteMutation.mutateAsync(); // إرسال طلب الحذف للسيرفر
    } catch (error) {
      console.error("خطأ في حذف الصورة:", error);
    } finally {
      setIsUploading(false);
    }
  }
};

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 max-w-6xl mx-auto">
        <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative mt-4">
          <img  
                 src={
                 userData?.data?.personal_photo_url || 
                 userData?.personal_photo_url || 
                 "/src/images/default-avatar.png"
               } 
            key={userData?.data?.personal_photo_url || userData?.personal_photo_url } 
             className={`w-28 h-28 md:w-32 md:h-32
             rounded-full border-4 border-white shadow-lg object-cover transition-opacity
              ${isUploading ? 'opacity-50' : 'opacity-100'}`} 
             
             />
            {isOwner && (
          <div>
           <button className="absolute bottom-1 right-2 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-all transform hover:scale-110 "onClick={()=>setShowEditMenu(!showEditMenu)}>
            <Edit2 className="w-3 h-3 text-gray-600" />
           </button>
            {showEditMenu && (
               <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg">
          
                <button onClick={handleEditClick}
                 className="px-3 py-1  flex items-center w-fit text-blue-500 hover:text-blue-400  ">
                           <MdEdit className='mr-1 '/> {t('edit')} 
                </button>
               <button onClick={handleDeletePhoto}
                 className="px-3 py-1  flex items-center w-fit text-red-500 hover:text-red-400">
                         <RiDeleteBin6Fill className='mr-1  '/> {t('delete')}
                </button>
              </div>
             )}
          </div>   )}
        </div>
        <div className="flex flex-col items-center md:items-start  ">
        <h2 className="text-4xl font-medium text-gray-900 mb-3 mt-5">{userData?.username}</h2>
        {!isOwner &&(
           <button 
           variant='secondary' type='edit'  size='sm'
           onClick={handleFollowClick}
           className=" md:w-[100px] w-[100px]  bg-follow-button text-text-button md:text-[24px] text-[24px] 
           hover:bg-hover-purple rounded-lg justify-center items-center"> {(userData?.is_following || userData?.data?.is_following) ? t('unfollow') : t('follow')}
           </button>
        )}
      </div>
      </div>
      <div className='flex flex-row items-center justify-center gap-5 sm:gap-5 mt-0'>
      {isOwner && (
       <div className="flex  gap-1">
        <div  className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform "
          onClick={() => setModalOpen(true)}>
          <div className="flex items-center gap-2 text-gray-500 mr-3 mt-5 ">
            <Users className="w-7 h-7 sm:w-8 sm:h-8  text-gray-900" />
            <span className="sm:text-3xl text-xl  font-medium text-gray-900  ">{t('following')}</span>
          </div>
          <span className="sm:text-3xl text-xl font-medium text-gray-900">  {userData?.following_count || userData?.data?.following_count || 0}</span>
        </div>
      </div>)}
      <div className="flex  gap-1">
        <div  className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform "
          onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-2 text-gray-500 mr-3 mt-5 ">
            <Users className="w-7 h-7 sm:w-8 sm:h-8  text-gray-900" />
            <span className="sm:text-3xl text-xl  font-medium text-gray-900  ">{t('followers')}</span>
          </div>
          <span className="sm:text-3xl text-xl font-medium text-gray-900">  {userData?.followers_count || userData?.data?.followers_count || 0}</span>
        </div>
      </div>
      
      <FollowersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        followers={followers} 
        isLoading={false} 
      />
      <FollowingModal 
        isOpen={ModalOpen} 
        onClose={() => setModalOpen(false)}
        userId={userData?.id || userData?.data?.id}  
        followingList={following} 
        isLoading={false} 
      />
     <AiModal 
       isOpen={showUnfollowModal} 
       onClose={() => setShowUnfollowModal(false)} 
       onuse={() => {
       const userId = userData?.id || userData?.data?.id;
       unfollowMutation.mutate(userId);
       setShowUnfollowModal(false);
       }}
       result={t('Are you sure you want to unfollow')}
       isLoading={unfollowMutation.isPending} // تمرير حالة التحميل للمودال
      />
      </div>
    </div>
    
  );
};
export default ProfileHeader;