import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useFollow } from '@/hook/UseFollow'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';
import MenuPanel from './Sidepanel/MenuPanel'
import { useTranslation } from 'react-i18next';
import EditPostModale from '@/components/Profile.jsx/EditPostModal';
import { usePostActions } from '@/hook/UsePostMutation'; 

dayjs.extend(relativeTime);
const HeaderPost = ({post}) => {
  const navigate=useNavigate()
  const { i18n } = useTranslation();
  const [menu, setMenu] = useState({});
  const { deleteMutation } = usePostActions();
  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};
 const handleEditPost = () => {
  // الانتقال لصفحة التعديل مع تمرير الآيدي في الرابط
  navigate(`/edit-post/${post.id}`);
};
 const handleDeletePost = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنشور؟")) {
      deleteMutation.mutate(post.id, {
        onSuccess: () => {
          // إغلاق المنيو بعد الحذف الناجح
          setMenu({});
          // يمكنك إضافة تنبيه بسيط هنا
          console.log("تم حذف المنشور بنجاح");
        }
      });
    }
  };
  const {followMutation}=useFollow()
  //في حال الباك ما رجع isfollowing
  const [isfollowing, setisfollowing] = useState(post.user?.is_following || false);
  const { currentUser } = useAuth();
  const handleFollow=(e)=>{
e.stopPropagation(); // يمنع الانتقال للصفحة
followMutation.mutate(post.user.id)
setisfollowing(!isfollowing);
  }
   const locale = i18n.language === 'ar' ? 'ar' : 'en';
  dayjs.locale(locale);

  const formattedDate = post.created_at
    ? dayjs(post.created_at).fromNow()
    : '';

  return (
    <div className='flex justify-between items-center '>
      <div className='flex justify-center items-center space-x-9'>
    <div className='flex items-center justify-center space-x-5' onClick={()=>navigate(`/profile/${post.user?.id}`)}>
    <img src= {post.user?.personal_photo_url||"/public/images/default avatar1.jpg"}
    className='md:w-15 md:h-15 w-14 h-14 rounded-full'/>
    <div>
      <div className='font-semibold text-lg md:text-xl'>{post.user?.username}</div>
      <div className='text-gray-600 text-sm'>{formattedDate}</div>
    </div>
    </div>
    <div> 
      {post.user?.id!==currentUser?.id&&(
      <button
onClick={handleFollow}
className={`px-3 py-2  text-sm md:text-[16px] rounded-md  font-semibold transition
${isfollowing
? "border-1 border-follow-button text-follow-button"
: "bg-follow-button text-white "}
`}
>

{isfollowing ? "Following" : "Follow"}

</button>)}
    </div>
    </div>
    <div className=' rounded-3xl border border-black w-[100px] md:w-[120px] text-center'>
     <p className=' text-lg md:text-xl p-1 '>{post.post_type||"general"}</p> 
      </div>
<MenuPanel
        id={post.id}
        menu={menu}
        toggleMenu={toggleMenu}
        size={28}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />
    </div>
  )
}

export default HeaderPost