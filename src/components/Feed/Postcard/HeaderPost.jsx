import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useFollow } from '@/hook/UseFollow'
import MenuPanel from './Sidepanel/MenuPanel'
import { useEffect } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';
import { UseMe } from '@/hook/UseQueryMe'
dayjs.extend(relativeTime);
const HeaderPost = ({post}) => {
  const {data}=UseMe()

  const { followMutation, unfollowMutation } = useFollow();
  const navigate=useNavigate()
  const [menu, setMenu] = useState({});
  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};
  const { i18n,t } = useTranslation();

  //في حال الباك ما رجع isfollowing
 const [isfollowing, setisfollowing] = useState(post.is_following);
const [isInitiallyFollowing] = useState(post.is_following);
useEffect(() => {
  setisfollowing(post.is_following);
}, [post.is_following]);
  const handleFollow=(e)=>{
e.stopPropagation(); // يمنع الانتقال للصفحة
  const mutation = isfollowing ? unfollowMutation : followMutation;
mutation.mutate(post.user.id, {
  onSuccess: () => {
    setisfollowing(prev => !prev);
  }
});
  }
const formattedDate = post.created_at 
  ? dayjs(post.created_at).locale(i18n.language).fromNow() 
  : '';



const shouldShowFollowLogic = 
  post.user?.id &&                              // ← guard جديد
  Number(post.user?.id) !== Number(data?.id) && 
  isInitiallyFollowing === false;
  return (
    <div className='flex justify-between items-center '>
      <div className='flex justify-center items-center space-x-9'>
    <div className='flex items-center justify-center space-x-5' onClick={()=>navigate(`/profile/${post.user?.id}`)}>
    <img src= {post.user?.personal_photo_url||"/images/default avatar1.jpg"}
    className='md:w-15 md:h-15 w-14 h-14 rounded-full'
    onError={(e) => { e.target.src = "/images/default avatar1.jpg" }}/>
    <div>
      <div className='font-semibold text-lg md:text-xl dark:text-white'>{post.user?.username}</div>
      <div className='text-gray-600 dark:text-gray-400 text-sm'>{formattedDate}</div>
    </div>
    </div>
    <div> 
      {shouldShowFollowLogic&&(
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
    <div className='flex justify-center items-center space-x-4'>
    <div className=' rounded-3xl border border-black dark:border-white w-[100px] md:w-[120px] text-center'>
    {post?.post_type ?(
     <p className=' text-lg md:text-xl p-1 dark:text-white '>{t(`post_types.${post.post_type}`,post.post_type)}</p> ):null}
      </div>
{Number(post.user?.id) === Number(data?.id) && (
      <MenuPanel
        id={post.id}
        menu={menu}
        toggleMenu={toggleMenu}
        size={28}
       // onEdit={handleEditPost}
       // onDelete={handleDeletePost}
      />
    )}</div>
    </div>
  )
}

export default HeaderPost