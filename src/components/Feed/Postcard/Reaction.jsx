import React, {useEffect,  useState } from 'react'
import CustomTooltip from './ReactioHover';
import { FaRegCommentDots } from "react-icons/fa";
import { usereaction } from '@/hook/UseMutationreact';
import { useQueryClient} from '@tanstack/react-query';
import { GoBookmark,GoBookmarkFill } from "react-icons/go";
import { motion, AnimatePresence } from 'framer-motion';
import { usesave } from '@/hook/UseMutationSave';

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
    //save
    const [localIsSaved, setLocalIsSaved] = useState(post.is_saved || false);

    // تحديث الحالة المحلية إذا تغيرت البيانات القادمة من الخارج (Prop)
    useEffect(() => {
        setLocalIsSaved(post.is_saved || false);
    }, [post.is_saved]);
    const saveMutation = usesave();

    // تابع التعامل مع الحفظ
    const handleSaveToggle = async (e) => {
        e.stopPropagation(); // منع انتشار الحدث لفتح المنشور

        const previousState = localIsSaved;

        // تحديث فوري للواجهة (Optimistic Update)
        setLocalIsSaved(!previousState);

        saveMutation.mutate(
            { postId: post.id },
            {
                onSuccess: (res) => {
                    // تحديث الحالة بناءً على رد السيرفر الفعلي
                    setLocalIsSaved(res.data.is_saved);
                    // تحديث الكاش لضمان مزامنة البيانات في كل مكان
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                },
                onError: () => {
                    // العودة للحالة السابقة في حال فشل الطلب
                    setLocalIsSaved(previousState);
                }
            }
        );
    };
  return (
    <div className='flex md:space-x-30 space-x-4  items-center '>
      <div>
     <button className='flex space-x-2 items-center md:rounded-2xl rounded-xl px-2 py-1  shadow-md dark:bg-dark-button '>
      <FaRegCommentDots className='md:text-xl text-sm text-gray-700 dark:text-gray-50'/>
      <div className='md:text-lg text-sm font-semibold text-gradient'onClick={(e) => {
    e.stopPropagation();
    onOpenComments();  
  }}>{commentCount ?? post.total_comments ?? 0}</div>
     </button>
     </div>
    <div className='flex md:space-x-4 space-x-2 items-center '>
      {reactionData.map((items)=>(
        <CustomTooltip  key={items.key} text={items.label}>
          <button
    onClick={(e) => e.stopPropagation()
    }
    className={`flex items-center space-x-2 px-2 py-1 rounded-2xl  ${ active[items.key]?' border border-follow-button dark:border-follow-button':' border border-gray-200 '} shadow text-lg w-fit dark:bg-dark-button dark:border-dark-button`}
  >
 <div onClick={(e)=>{
  e.stopPropagation()
  handlereaction(items.key)
   onClose()}}
  
    className={`md:text-xl text-sm transition-colors ${ active[items.key]?' text-follow-button':'text-gray-700'} `}>
  {items.icon}</div>
  <motion.div 
      // أنميشن خفيف للرقم عند التغيير
      key={localCounts[items.key]}
      initial={{ scale: active[items.key] ? 1.5 : 0.6 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className={`font-semibold md:text-lg text-sm transition-colors ${
        active[items.key] ? 'text-edit-button' : 'text-gradient'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onOpenReaction(items.key);
      }}
    >
  {localCounts[items.key] || 0}</motion.div>
  
</button>
  </CustomTooltip>
  
      ))}
     
      </div>
<div onClick={handleSaveToggle} className="cursor-pointer md:ms-24  ">
   {localIsSaved ? (
        <GoBookmarkFill 
            
            className="relative md:start-32  md:text-[36px] text-[22px]  text-blue-700 transition-colors duration-300" 
        />
    ) : (
        <GoBookmark 
          
            className="relative md:start-32  md:text-[36px] text-[22px] text-gray-500 dark:text-gray-300 transition-colors duration-300" 
        />
    )}
</div>
    </div>
  )
}

export default Reaction