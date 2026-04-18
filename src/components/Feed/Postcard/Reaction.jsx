import React, {useEffect,  useState } from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { PiBugBeetle } from "react-icons/pi";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { FaRegCommentDots } from "react-icons/fa";
import { usereaction } from '@/hook/UseMutationreact';
import { useQueryClient} from '@tanstack/react-query';
const Reaction = ({post,onOpenReaction,onClose,reactionData, incrementComment, commentCount,onOpenComments}) => {
///لما يكون عنا اكتر من زر مافينا نحط حالة وحدة للكل
const [active,setactive]=useState({
  useful: post.user_reaction === "useful",
  not_useful: post.user_reaction === "not_useful",
  same_problem: post.user_reaction === "same_problem",
  creative_solution: post.user_reaction === "creative_solution",})
const queryClient=useQueryClient()
const [reaction,setreaction]=useState({
  useful: post.reaction_counts?.useful || 0,
  not_useful: post.reaction_counts?.not_useful || 0,
  creative_solution: post.reaction_counts?.creative_solution || 0,
  same_problem: post.reaction_counts?.same_problem || 0,
  comment: commentCount
})
const reactionMutation=usereaction();
  //تابع لزيادة وانقاص عدد الايكات في البيانات الستاتيكية
  const handlereaction=(type)=>{
  //setreaction(prev=>({...prev,[type]:active[type]?prev[type]-1:prev[type]+1}))
setactive(
  prev => ({
  useful: type === "useful" ? !prev.useful : false,
  not_useful: type === "not_useful" ? !prev.not_useful : false,
  same_problem: type === "same_problem" ? !prev.same_problem : false,
  creative_solution: type === "creative_solution" ? !prev.creative_solution : false,
})
  );

  reactionMutation.mutate(
  {
    postId: post.id,
    reaction_type: type,
  },
  {
    onSuccess: (res) => {
      //setreaction(res.data.reaction_counts);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["reaction", post.id, type] });
    },
    onError: () => {
       setactive({
    useful: post.user_reaction === "useful",
    not_useful: post.user_reaction === "not_useful",
    same_problem: post.user_reaction === "same_problem",
    creative_solution: post.user_reaction === "creative_solution",
  });
    }
  }
);

   /*if(type === 'comment' && incrementComment){
      incrementComment(); // يحدث count في PostCard
    }
  }*/
  useEffect(() => {
  setreaction(prev => ({ ...prev, comment: commentCount }));
}, [commentCount]);
  return (
    <div className='flex space-x-40 items-center '>
      <div>
     <button className='flex space-x-2 items-center rounded-2xl px-2 py-1 border border-gray-200 shadow-md dark:bg-gray-100 '>
      <FaRegCommentDots className='md:text-xl text-lg text-gray-700'/>
      <div className='md:text-lg text-md font-semibold text-gradient'onClick={(e) => {
    e.stopPropagation();
    onOpenComments();  
  }}>{reaction.comment}</div>
     </button>
     </div>
    <div className='flex space-x-3.5  '>
      {reactionData.map((items)=>(
        <div  key={items.key}>
          <button
    onClick={(e) => e.stopPropagation()
    }
    className={`flex items-center space-x-3 px-2 py-1 rounded-2xl border border-gray-200 shadow text-lg w-fit dark:bg-gray-100 `}
  >
 <div onClick={(e)=>{
  e.stopPropagation()
  handlereaction(items.key)
   onClose()}} className='md:text-xl text-lg text-gray-700 '>
  {items.icon}</div>
  <div className='text-gradient font-semibold md:text-lg text-md' onClick={(e)=>{ e.stopPropagation(); 
    onOpenReaction(items.key)}
  }>{reaction[items.key]}</div>
</button>
  </div>
      ))}
      </div>
    
    </div>
  )
}}

export default Reaction