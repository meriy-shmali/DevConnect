import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
const HeaderPost = ({post}) => {
  const navigate=useNavigate()
  //في حال الباك ما رجع isfollowing
  const[isfollowing,setisfollowing]=useState(post.user?.isfollowing||false);
    const { currentUser } = useAuth();
  const handleFollow=(e)=>{
e.stopPropagation(); // يمنع الانتقال للصفحة

setisfollowing(!isfollowing);
  }
  return (
    <div className='flex justify-between items-center '>
      <div className='flex justify-center items-center space-x-9'>
    <div className='flex items-center justify-center space-x-5' onClick={()=>navigate(`/profile/${post.user?.id}`)}>
    <img src= {post.user?.avatar||"/public/images/default avatar1.jpg"}
    className='w-15 h-16 rounded-full'/>
    <div>
      <div className='font-semibold text-xl'>{post.user?.name}</div>
      <div className='text-gray-600 text-sm'>{post.date||post.createdAt}</div>
    </div>
    </div>
    <div> 
      {post.user.id!==currentUser?.id&&(
      <button
onClick={handleFollow}
className={`px-3 py-2 rounded-md text-sm font-semibold transition
${isfollowing
? "border-1 border-follow-button text-follow-button"
: "bg-follow-button text-white "}
`}
>

{isfollowing ? "Following" : "Follow"}

</button>)}
    </div>
    </div>
    <div className=' rounded-3xl border border-black w-[120px] text-center'>
     <p className='text-xl p-1 '>{post.category||"general"}</p> 
      </div>

    </div>
  )
}

export default HeaderPost