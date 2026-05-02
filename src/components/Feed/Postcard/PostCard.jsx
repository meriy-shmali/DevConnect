import React, { useState } from 'react'
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'
import SidebarPanel from './Sidepanel'
import { useTranslation } from 'react-i18next'
import { staticuser } from '@/Utils/data/staticuser'
import { AnimatePresence } from 'framer-motion'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { PiBugBeetle } from "react-icons/pi";
import { MdLightbulbOutline } from "react-icons/md";
import { usequeryreaction } from '@/hook/UseQueryreact';
import { useaddcomment } from '@/hook/UseMutationComment';
import { staticComment } from '@/Utils/data/staticcomment';
import { usecomment } from '@/hook/UseQueryComment';
import { useEffect } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6';
import { useQueryClient } from "@tanstack/react-query";
import Trending from './Trending';
import { UseMe } from '@/hook/UseQueryMe'
const PostCard = ({post}) => {
  const{t}=useTranslation()
  const { data: currentUser } = UseMe();
  const [sort,setsort]=useState('latest');//المستخدم يغير الفلترة
  const[paneltype,setpaneltype]=useState(null)
  const [commentCount, setCommentCount] = useState(post.total_comments)
 // const [comments, setComments] = useState(staticComment[post.id] || []); 
  useEffect(() => {
  setCommentCount(post.total_comments);
}, [post.total_comments]);
// نخزن التعليقات في الحالة لتحديث العدد فورًا
  /*const handleOpenReaction = (type) => {
  setpaneltype(type)
};*/
const handleTogglePanel = (type) => {
  if (paneltype === type) {
    // إذا نفس النوع مضغوط مرتين → سكّر
    setpaneltype(null);
  } else {
    // إذا نوع جديد → افتح
    setpaneltype(type);
  }
};
/*const handleopencomment=()=>{
  setpaneltype('comments')
}*/
const handleToggleComments = () => {
  if (paneltype === 'comments') {
    // إذا نفس النوع مضغوط مرتين → سكّر
    setpaneltype(null);
  } else {
    // افتح التعليقات
    setpaneltype('comments');
  }
};
const handleClose = () => {
 setpaneltype(null)
};
const commentsData = usecomment(post.id, sort);
const data = usequeryreaction(
  post.id,
  paneltype !== "comments" ? paneltype : null
);
  const queryClient = useQueryClient();
/*const users = Array.isArray(data)
  ? data
  : Array.isArray(staticuser[paneltype])
  ? staticuser[paneltype]
  : [];*/
const reactionData = [
  { key: "useful", label: "useful", count: post.reaction_counts?.useful , icon: <AiOutlineLike /> },
  { key: "not_useful", label: "not useful", count: post.reaction_counts?.not_useful, icon: <AiOutlineDislike /> },
    { key: "creative_solution", label: "creative solution", count:  post.reaction_counts?.creative_solution, icon: <MdLightbulbOutline /> },
  { key: "same_problem", label: "same problem", count: post.reaction_counts?.same_problem , icon: <PiBugBeetle /> }
];
const reactionMap = Object.fromEntries(
  reactionData.map(item => [item.key, item])
);
const addcommntMutation=useaddcomment()
const handleAddComment = ({ postId, text }) => {
  if (!text.trim()) return;

  // 1. تحديث العداد فوراً
  setCommentCount(prev => prev + 1);

  const tempId = Date.now();
  const optimisticComment = {
    id: tempId,
    content: text,
    user_username: currentUser?.username,
    user_photo_url: currentUser?.personal_photo_url,
    created_at: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    replies_count: 0,
    is_optimistic: true
  };

  // 2. تحديث الكاش (مهم جداً: استهدفي المفتاح الرئيسي ['comment', postId])
  queryClient.setQueriesData({ queryKey: ['comment', postId] }, (oldData) => {
    if (!oldData) return [optimisticComment];
    // إذا كانت البيانات داخل data (مثل Axios)
    if (oldData.data) {
      return { ...oldData, data: [optimisticComment, ...oldData.data] };
    }
    // إذا كانت مصفوفة مباشرة
    return [optimisticComment, ...oldData];
  });

  // 3. Mutation
  addcommntMutation.mutate(
    { postId, content: text },
    {
      onSuccess: (res) => {
        // استبدال الوهمي بالحقيقي
        queryClient.setQueriesData({ queryKey: ['comment', postId] }, (oldData) => {
          const serverComment = res.data?.comment;
          const update = (list) => list.map(c => c.id === tempId ? serverComment : c);
          if (oldData?.data) return { ...oldData, data: update(oldData.data) };
          return Array.isArray(oldData) ? update(oldData) : oldData;
        });
      },
      onError: () => {
        setCommentCount(prev => prev - 1);
        queryClient.invalidateQueries({ queryKey: ['comment', postId] });
      }
    }
  );
};

  return (
    <div className='bg-white dark:bg-dark-post-background rounded-3xl shadow-xl w-[600px] md:w-[900px] h-fit p-8 border border-gray-300 flex-col space-y-10  justify-center'>
    <Trending post={post}/>
    <HeaderPost post={post}/>
    <BodyPost post={post} />
    <Reaction post={post}  onOpenReaction={handleTogglePanel} onClose={handleClose} reactionData={reactionData}
     incrementComment={() => setCommentCount(prev => prev + 1)}
     commentCount={commentCount}
     onOpenComments={ handleToggleComments}/>
      <AnimatePresence>
    {paneltype && (
  <SidebarPanel
  key={paneltype}
    type={paneltype}
   title={paneltype === "comments" ? t("comments") : reactionMap[paneltype]?.label}
     icon={paneltype === "comments" ? <FaRegCommentDots /> : reactionMap[paneltype]?.icon}
   items={
      paneltype === "comments"
        ? (commentsData||[])
        : (data||[])
   }
 currentUser={currentUser}
    showFilter={paneltype === "comments"}
    sort={sort}
    setSort={setsort}
    onClose={handleClose}
    postId={post.id}
    setCommentCount={setCommentCount}
  />
)}
    </AnimatePresence>
    <Comment post={post}
    onAddComment={handleAddComment } />
    </div>
  )
}

export default PostCard