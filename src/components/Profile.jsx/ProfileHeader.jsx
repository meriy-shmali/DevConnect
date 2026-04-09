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
const ProfileHeader = ({ userData }) => {
  // --- بيانات اختبارية (Dummy Data) ---
  const dummyFollowers = [
    {
      id: 1,
      username: "RittaMakdissi",
      avatar: "https://i.pravatar.cc/150?u=1",
      fullName: "Ritta Makdissi",
      isFollowing: false
    },
    {
      id: 2,
      username: "meriy_shmali",
      avatar: "https://i.pravatar.cc/150?u=2",
      fullName: "Meriya Shmali",
      isFollowing: true
    },
    {
      id: 3,
      username: "dev_connect_user",
      avatar: "https://i.pravatar.cc/150?u=3",
      fullName: "Developer User",
      isFollowing: false
    },
    {
      id: 4,
      username: "ahmad_react",
      avatar: "https://i.pravatar.cc/150?u=4",
      fullName: "Ahmad JS",
      isFollowing: false
    },
     {
      id: 5,
      username: "RittaMakdissi",
      avatar: "https://i.pravatar.cc/150?u=1",
      fullName: "Ritta Makdissi",
      isFollowing: true
    },
     {
      id: 6,
      username: "RittaMakdissi",
      avatar: "https://i.pravatar.cc/150?u=1",
      fullName: "Ritta Makdissi",
      isFollowing: false
    },
     {
      id: 7,
      username: "RittaMakdissi",
      avatar: "https://i.pravatar.cc/150?u=1",
      fullName: "Ritta Makdissi",
      isFollowing: false
    },
  ];

  const { t } = useTranslation();
  const [showEditMenu,setShowEditMenu]=useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [ModalOpen, setModalOpen] = useState(null);
  const { data: followers, isLoading, error } = useGetFollowers(userData?.id);
  const { data: following} = useGetFollowing(userData?.id);
  const fileInputRef = useRef(null);
  const isOwner = useIsOwner(userData?.id);
  const handleEditClick = () => {
    setShowEditMenu(false);
    fileInputRef.current.click();
  };

  const [ showUnfollowModal,setShowUnfollowModal] = useState(false);
  const handleFollowClick = () => {
    if ( userData?.isFollowing){
      setShowUnfollowModal(true);
    }else{
      followUser.mutate(userData?.id)
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    //if (!file) return;
    if(file){console.log(file.name)}
    const formData = new FormData();
    formData.append('image', file); 
    updateMutation.mutate(formData)
    setIsUploading(true);
    try {
      // هنا نستدعي دالة الـ API الخاصة بكِ
      // await updateProfileImageReq(formData); 
      
      toast.success("تم تحديث الصورة بنجاح");
    } catch (error) {
      toast.error("فشل في رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };
const updateMutation = useUpdatePersonalInfo(userData?.username);
const handleDeletePhoto = async () => {
  const confirmDelete = window.confirm("هل أنتِ متأكدة من حذف الصورة الشخصية؟");
  
  if (confirmDelete) {
    setShowEditMenu(false); 
    setIsUploading(true);  

    try {
    
      await updateMutation.mutateAsync({ avatar: null }); 
      toast.success("تم حذف الصورة بنجاح");
    } catch (error) {
      toast.error("فشل حذف الصورة");
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
          <img src={userData?.avatar ||  'https://i.pravatar.cc/150?u=1'}  className={`w-28 h-28 md:w-32 md:h-32
             rounded-full border-4 border-white shadow-lg object-cover transition-opacity
              ${isUploading ? 'opacity-50' : 'opacity-100'}`} 
              onError={(e)=>{e.target.onError=null;
                e.target.src = 'src/images/default-avatar.png'
              }}/>
            {isOwner && (
          <div>
           <button className="absolute bottom-1 right-2 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-all transform hover:scale-110 "onClick={()=>setShowEditMenu(!showEditMenu)}>
            <Edit2 className="w-3 h-3 text-gray-600" />
           </button>
            {showEditMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 shadow-2xl rounded-xl z-50 py-1">
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50" onClick={handleEditClick}>
                  <MdEdit className="w-3 h-3 text-blue-500" /> {t('edit')}
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-[12px] text-red-600 hover:bg-red-50 transition-colors" onClick={handleDeletePhoto}>
                  <Trash2 className="w-3 h-3" /> {t('delete')}
                </button>
              </div>
             )}
          </div>   )}
        </div>
        <div className="flex flex-col items-center md:items-start  ">
        <h2 className="text-4xl font-medium text-gray-900 mb-3 mt-5">{userData?.username}</h2>
           <button 
           variant='secondary' type='edit'  size='sm'
           onClick={handleFollowClick}
           className=" md:w-[100px] w-[100px]  bg-follow-button text-text-button md:text-[24px] text-[24px] 
           hover:bg-hover-purple rounded-lg justify-center items-center"> {userData?.isFollowing ? t('unfollow') : t('follow')}
           </button>
      </div>
      </div>
      <div className='flex flex-row items-center justify-center gap-5 sm:gap-5 mt-0'>
      
       <div className="flex  gap-1">
        <div  className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform "
          onClick={() => setModalOpen(true)}>
          <div className="flex items-center gap-2 text-gray-500 mr-3 mt-5 ">
            <Users className="w-7 h-7 sm:w-8 sm:h-8  text-gray-900" />
            <span className="sm:text-3xl text-xl  font-medium text-gray-900  ">{t('following')}</span>
          </div>
          <span className="sm:text-3xl text-xl font-medium text-gray-900">{userData?.followingCount || 0}k</span>
        </div>
      </div>
      <div className="flex  gap-1">
        <div  className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform "
          onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-2 text-gray-500 mr-3 mt-5 ">
            <Users className="w-7 h-7 sm:w-8 sm:h-8  text-gray-900" />
            <span className="sm:text-3xl text-xl  font-medium text-gray-900  ">{t('followers')}</span>
          </div>
          <span className="sm:text-3xl text-xl font-medium text-gray-900">{userData?.followersCount || 0}k</span>
        </div>
      </div>
      
      <FollowersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        followers={dummyFollowers} 
        isLoading={false} 
      />
      <FollowingModal 
        isOpen={ModalOpen} 
        onClose={() => setModalOpen(false)} 
        followingList={dummyFollowers} 
        isLoading={false} 
      />
      <AiModal 
        isOpen={showUnfollowModal} 
        onClose={() => setShowUnfollowModal(false)} 
        onuse={()=>{followUser.mutate(userData?.id);
                    setShowUnfollowModal(false);
        }}
        result={t('Are you sure you want to unfollow')}
        isLoading={false} 
      />
      </div>
    </div>
    
  );
};
export default ProfileHeader;