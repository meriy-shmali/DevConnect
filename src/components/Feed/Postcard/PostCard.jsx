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
const PostCard = ({post}) => {
  const{t}=useTranslation()
  const [sort,setsort]=useState('latest');//المستخدم يغير الفلترة
  const[paneltype,setpaneltype]=useState(null)
  const [commentCount, setCommentCount] = useState(post.total_comments)
  const [comments, setComments] = useState(staticComment[post.id] || []); 
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
const { data } = usequeryreaction(
  post.id,
  paneltype !== "comments" ? paneltype : null
);
  const queryClient = useQueryClient();
const users = Array.isArray(data)
  ? data
  : Array.isArray(staticuser[paneltype])
  ? staticuser[paneltype]
  : [];
const reactionData = [
  { key: "useful", label: "useful", count: post.reaction_counts?.useful , icon: <AiOutlineLike /> },
  { key: "not_useful", label: "not useful", count: post.reaction_counts?.not_useful, icon: <AiOutlineDislike /> },
  { key: "same_problem", label: "same problem", count: post.reaction_counts?.same_problem , icon: <PiBugBeetle /> },
  { key: "creative_solution", label: "creative solution", count:  post.reaction_counts?.creative_solution, icon: <MdLightbulbOutline /> }
];
const reactionMap = Object.fromEntries(
  reactionData.map(item => [item.key, item])
);
const addcommntMutation=useaddcomment()
const handleAddComment = (text) => {
  const newComment = {
    id: Date.now(), // id مؤقت للواجهة
    text,
    user: { name: "You", avatar: "" },
    likes: 0,
  };

  setComments(prev => [newComment, ...prev]); // إضافة التعليق جديد بالواجهة فورًا
  setCommentCount(prev => prev + 1);

  addcommntMutation.mutate({ postId: post.id, text },{
    onSuccess(){//حسب الباك
     queryClient.invalidateQueries({
  queryKey: ['comment', post.id]
});
    }
  }
  ); // إرسال للباك
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
  /*  items={
      paneltype === "comments"
        ? commentsData
        : users
    }*/
  items={
  paneltype === "comments"
    ? (staticComment[post.id] || [])
    : users
}
    showFilter={paneltype === "comments"}
    sort={sort}
    setSort={setsort}
    onClose={handleClose}
    postId={post.id}
  />
)}
    </AnimatePresence>
    <Comment post={post}
    onAddComment={handleAddComment } />
    </div>
  )
}

export default PostCard