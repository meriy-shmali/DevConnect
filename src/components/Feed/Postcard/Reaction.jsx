import React, {useEffect,  useState } from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { PiBugBeetle } from "react-icons/pi";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { FaRegCommentDots } from "react-icons/fa";
import { usereaction } from '@/hook/UseMutationreact';

const Reaction = ({post,onOpenReaction,onClose,reactionData, incrementComment, commentCount,onOpenComments}) => {
///لما يكون عنا اكتر من زر مافينا نحط حالة وحدة للكل
const [active,setactive]=useState({})
const [reaction,setreaction]=useState({
  likes: post.likes,
  dislikes: post.dislikes,
  ideas: post.ideas,
  problem: post.problem,
  comment: commentCount
})
const reactionMutation=usereaction();
  //تابع لزيادة وانقاص عدد الايكات في البيانات الستاتيكية
  const handlereaction=(type)=>{
  setreaction(prev=>({...prev,[type]:active[type]?prev[type]-1:prev[type]+1}))
setactive(prev => ({
    ...prev,
    [type]: !prev[type]
  }));
  reactionMutation.mutate({
    postId:post.id,
    type:type
  })
   if(type === 'comment' && incrementComment){
      incrementComment(); // يحدث count في PostCard
    }
  }
  useEffect(() => {
  setreaction(prev => ({ ...prev, comment: commentCount }));
}, [commentCount]);
  return (
    <div className='flex space-x-40 items-center '>
      <div>
     <button className='flex space-x-2 items-center rounded-2xl px-2 py-1 border border-gray-200 shadow-md '>
      <FaRegCommentDots className='text-xl text-gray-700'/>
      <div className='text-lg font-semibold text-gradient'onClick={(e) => {
    e.stopPropagation();
    onOpenComments(); // 👈 بدل ما كان فاضي
  }}>{reaction.comment}</div>
     </button>
     </div>
    <div className='flex space-x-3.5  '>
      {reactionData.map((items)=>(
        <div className=''>
          <button
    key={items.key}
    onClick={(e) => e.stopPropagation()
    }
    className={`flex items-center space-x-3 px-2 py-1 rounded-2xl border border-gray-200 shadow text-lg w-fit `}
  >
 <div onClick={()=>{onClose()
  handlereaction(items.key)}} className='text-xl text-gray-700'>
  {items.icon}</div>
  <div className='text-gradient font-semibold' onClick={(e)=>{ e.stopPropagation(); 
    onOpenReaction(items.key)}
  }>{reaction[items.key]}</div>
</button>
  </div>
      ))}
      </div>
    
    </div>
  )
}

export default Reaction