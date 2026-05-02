import React, {useEffect,  useState } from 'react'
import CustomTooltip from './ReactioHover';
import { FaRegCommentDots } from "react-icons/fa";
import { usereaction } from '@/hook/UseMutationreact';
import { useQueryClient} from '@tanstack/react-query';
const Reaction = ({post,onOpenReaction,onClose,reactionData, incrementComment, commentCount,onOpenComments}) => {
///لما يكون عنا اكتر من زر مافينا نحط حالة وحدة للكل
const [active, setactive] = useState({
        useful: post.user_reaction === "useful",
        not_useful: post.user_reaction === "not_useful",
          creative_solution: post.user_reaction === "creative_solution",
        same_problem: post.user_reaction === "same_problem",
      
    });
    const [localCounts, setLocalCounts] = useState(post.reaction_counts || {});
    useEffect(() => {
        setactive({
            useful: post.user_reaction === "useful",
            not_useful: post.user_reaction === "not_useful",
            creative_solution: post.user_reaction === "creative_solution",
            same_problem: post.user_reaction === "same_problem",
          
        });setLocalCounts(post.reaction_counts || {});
    }, [post.user_reaction, post.reaction_counts]);
const queryClient=useQueryClient()
const reactionMutation=usereaction();
  //تابع لزيادة وانقاص عدد الايكات في البيانات الستاتيكية
const handlereaction = async (type) => {
  const previousActive = { ...active };
    const previousCounts = { ...localCounts };
    await queryClient.cancelQueries({ queryKey: ["posts"] });
        // تحديث بصري سريع (Optimistic Update)
        setactive(prev => {
      const newState = { useful: false, not_useful: false, same_problem: false, creative_solution: false };
      // إذا ضغط على نفس التفاعل -> اجعل الكل false (حذف)
      // إذا ضغط على تفاعل جديد -> اجعل النوع الجديد فقط true
      if (prev[type]) return newState; 
      return { ...newState, [type]: true };
    });
    setLocalCounts(prev => {
      const newCounts = { ...prev };
      
      // 1. إذا كان هناك تفاعل سابق، انقصه
      Object.keys(active).forEach(key => {
        if (active[key] && newCounts[key] > 0) {
          newCounts[key] -= 1;
        }
      });

      // 2. إذا لم يكن المستخدم قد ضغط على نفس التفاعل (أي يريد إضافة تفاعل جديد أو تبديل)
      if (!active[type]) {
        newCounts[type] = (newCounts[type] || 0) + 1;
      }

      return newCounts;
    });
        reactionMutation.mutate(
            { postId: post.id, reaction_type: type },
            {
                onSuccess: () => {
                    // إعادة جلب البيانات لتحديث العدادات الحقيقية
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                },
                onError: () => {
                    // العودة للحالة الأصلية في حال فشل الطلب
                    setactive(previousActive);
          setLocalCounts(previousCounts);
                }
            }
        );
    };
  return (
    <div className='flex space-x-40 items-center '>
      <div>
     <button className='flex space-x-2 items-center rounded-2xl px-2 py-1 border border-gray-200 shadow-md dark:bg-gray-100 '>
      <FaRegCommentDots className='md:text-xl text-lg text-gray-700'/>
      <div className='md:text-lg text-md font-semibold text-gradient'onClick={(e) => {
    e.stopPropagation();
    onOpenComments();  
  }}>{commentCount ?? post.total_comments ?? 0}</div>
     </button>
     </div>
    <div className='flex space-x-3.5  '>
      {reactionData.map((items)=>(
        <CustomTooltip  key={items.key} text={items.label}>
          <button
    onClick={(e) => e.stopPropagation()
    }
    className={`flex items-center space-x-3 px-2 py-1 rounded-2xl  ${ active[items.key]?' border border-follow-button':' border border-gray-200 '} shadow text-lg w-fit dark:bg-gray-100 `}
  >
 <div onClick={(e)=>{
  e.stopPropagation()
  handlereaction(items.key)
   onClose()}}
  
    className={`md:text-xl text-lg transition-colors ${ active[items.key]?' text-follow-button':'text-gray-700'} `}>
  {items.icon}</div>
  <div className={` font-semibold md:text-lg text-md transition-colors ${
    active[items.key]?'text-edit-button ':'text-gradient'}`} onClick={(e)=>{ e.stopPropagation(); 
    onOpenReaction(items.key)}
  }>{localCounts[items.key] || 0}</div>
</button>
  </CustomTooltip>
      ))}
      </div>
    
    </div>
  )
}

export default Reaction