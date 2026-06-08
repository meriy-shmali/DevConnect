import React, { useState, useRef, useEffect } from 'react';
import { Users, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetFollowers } from '@/hook/UseGetFollowers';
import { useGetFollowing } from '@/hook/UseGetFollowing';
import { MdEdit } from 'react-icons/md';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import { useGetProfile } from '@/hook/UseProfileData';
import AiModal from './AiModal';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { useUpdateProfilePhoto, useDeleteProfilePhoto } from '@/hook/UseUpdateProfileMutation';
import { useFollow } from '@/hook/UseFollow';

const ProfileHeader = ({ userData }) => {
  const { t } = useTranslation();
  const { followMutation, unfollowMutation } = useFollow(); 
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [ModalOpen, setModalOpen] = useState(null);
  const { data: followers } = useGetFollowers(userData?.id); 
  const { data: following } = useGetFollowing(userData?.id);
  const fileInputRef = useRef(null);
  const deleteMutation = useDeleteProfilePhoto();
  const { id } = useParams();
  const profileTarget = id || 'me';
  const { data: profile } = useGetProfile(profileTarget);

  let loggedInUserId = null;
  const token = localStorage.getItem("access");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      loggedInUserId = payload.user_id || payload.id;
    } catch (e) {}
  }

  const currentUserId = userData?.id || userData?.data?.id || profile?.id;
  const isOwner = 
    profileTarget === 'me' || 
    (loggedInUserId && currentUserId && String(currentUserId) === String(loggedInUserId));

  const handleEditClick = () => {
    setShowEditMenu(false);
    fileInputRef.current.click();
  };

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const handleFollowClick = () => {
    if (userData?.is_following || userData?.data?.is_following) { 
      setShowUnfollowModal(true);
    } else {
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
        await updateMutation.mutateAsync(formData); 
      } finally {
        setIsUploading(false);
      }
    }
  };

  const menuRef = useRef(null); 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowEditMenu(false);
      }
    };

    if (showEditMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditMenu]);

  const updateMutation = useUpdateProfilePhoto();
  
  // 🟢 تم إصلاح هذه الدالة وإضافة نافذة تأكيد صحيحة ومحميّة من التوقف
  const handleDeletePhoto = async () => {
    if (window.confirm(t('Are you sure you want to delete your profile photo?'))) {
      try {
        setIsUploading(true);
        setShowEditMenu(false); 
        await deleteMutation.mutateAsync(); 
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 max-w-full mx-auto">
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
            src={userData?.data?.personal_photo_url || userData?.personal_photo_url || "/images/default-avatar.png"} 
            key={userData?.data?.personal_photo_url || userData?.personal_photo_url} 
            className={`w-26 h-26 md:w-18 md:h-18 rounded-full border-2 border-white shadow-lg object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`} 
          />
          {isOwner && (
            <div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-all transform hover:scale-110 dark:bg-dark-post-background" onClick={() => setShowEditMenu(!showEditMenu)}>
                <Edit2 className="w-2 h-2 text-gray-600 dark:text-gray-50" />
              </button>
              {showEditMenu && (
                <div ref={menuRef} className="absolute right-0 mt-2 bg-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg">
                  <button onClick={handleEditClick} className="px-3 py-1 flex items-center w-fit text-blue-500 hover:text-blue-400">
                    <MdEdit className='mr-1' /> {t('edit')} 
                  </button>
                  <button onClick={handleDeletePhoto} className="px-3 py-1 flex items-center w-fit text-red-500 hover:text-red-400">
                    <RiDeleteBin6Fill className='mr-1' /> {t('delete')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col md:space-y-3 items-center md:items-start">
          <h2 className="text-3xl font-medium text-gray-900 mb-3 mt-4 dark:text-gray-50">{userData?.username}</h2>
          {!isOwner && (
           <button 
  onClick={handleFollowClick}
  className={`md:w-fit md:px-2 md:py-1.5 px-2 py-1.5 mt-3 md:mt-0 rounded-md transition whitespace-nowrap ${
    (userData?.is_following || userData?.data?.is_following)
      ? "border border-follow-button text-follow-button"
      : "bg-follow-button text-text-button md:text-lg text-sm hover:bg-hover-purple"
  }`}
>
  {(userData?.is_following || userData?.data?.is_following) ? t('unfollow') : t('follow')}
</button>
          )}
        </div>
      </div>
      
      <div className='flex flex-row items-center justify-center gap-5 sm:gap-5 mt-0'>
        {isOwner && (
          <div className="flex gap-1">
            <div className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform" onClick={() => setModalOpen(true)}>
              <div className="flex items-center gap-2 text-gray-500 mr-3 mt-4">
                <Users className="w-7 h-7 sm:w-5 sm:h-5 text-gray-900 dark:text-gray-50" />
                <span className="sm:text-2xl text-xl font-medium text-gray-900 dark:text-gray-50 font-title">{t('following')}</span>
              </div>
              <span className="sm:text-2xl text-xl font-medium text-gray-900 dark:text-gray-50">{userData?.following_count || userData?.data?.following_count || 0}</span>
            </div>
          </div>
        )}
        <div className="flex gap-1">
          <div className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform" onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-2 text-gray-500 mr-3 mt-4">
              <Users className="w-7 h-7 sm:w-5 sm:h-5 text-gray-900 dark:text-gray-50" />
              <span className="sm:text-2xl text-xl font-medium text-gray-900 dark:text-gray-50 font-title">{t('followers')}</span>
            </div>
            <span className="sm:text-2xl text-xl font-medium text-gray-900 dark:text-gray-50">{userData?.followers_count || userData?.data?.followers_count || 0}</span>
          </div>
        </div>
        
        <FollowersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} followers={followers} isLoading={false} currentUserId={currentUserId} />
        <FollowingModal isOpen={ModalOpen} onClose={() => setModalOpen(false)} userId={userData?.id || userData?.data?.id} followingList={following} isLoading={false} currentUserId={currentUserId} />
        <AiModal 
          isOpen={showUnfollowModal} 
          onClose={() => setShowUnfollowModal(false)} 
          onuse={() => {
            const userId = userData?.id || userData?.data?.id;
            unfollowMutation.mutate(userId);
            setShowUnfollowModal(false);
          }}
          result={t('unfollow_confirm')}
          isLoading={unfollowMutation.isPending} 
        />
      </div>
    </div>
  );
};

export default ProfileHeader;