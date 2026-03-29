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
import { usequeryreaction } from '@/hook/UseQueryreact'
import { useaddcomment } from '@/hook/UseMutationComment'
import { staticComment } from '@/Utils/data/staticcomment'
import { usecomment } from '@/hook/UseQueryComment'
import { FaRegCommentDots } from 'react-icons/fa6'
const PostCard = ({post}) => {
  const{t}=useTranslation()
  const [sort,setsort]=useState('latest');//المستخدم يغير الفلترة
  const[paneltype,setpaneltype]=useState(null)
  const [commentCount, setCommentCount] = useState(post.comment)
  const [comments, setComments] = useState(staticComment[post.id] || []); 
// نخزن التعليقات في الحالة لتحديث العدد فورًا
  const handleOpenReaction = (type) => {
  setpaneltype(type)
};
const handleopencomment=()=>{
  setpaneltype('comments')
}
const handleClose = () => {
 setpaneltype(null)
};
const { data: commentsData = [] } = usecomment(post.id, sort);
const { data } = usequeryreaction(
  post.id,
  paneltype !== "comments" ? paneltype : null
);
const users = data?.length ? data : staticuser[paneltype] || [];
const reactionData = [
  { key: "likes", label: "useful", count: post.likes, icon: <AiOutlineLike /> },
  { key: "dislikes", label: "not useful", count: post.dislikes, icon: <AiOutlineDislike /> },
  { key: "problem", label: "same problem", count: post.problem, icon: <PiBugBeetle /> },
  { key: "ideas", label: "creative solution", count: post.ideas, icon: <MdLightbulbOutline /> }
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
    onSuccess(data){//حسب الباك
      setCommentCount(data.newCommentCount)
    }
  }
  ); // إرسال للباك
};
  return (
    <div className='bg-white rounded-3xl shadow-xl w-[900px] h-fit p-8 border border-gray-300 flex-col space-y-10'>
    <HeaderPost post={post}/>
    <BodyPost post={post} />
    <Reaction post={post}  onOpenReaction={handleOpenReaction} onClose={handleClose} reactionData={reactionData}
     incrementComment={() => setCommentCount(prev => prev + 1)}
     commentCount={commentCount}
     onOpenComments={handleopencomment}/>
      <AnimatePresence>
    {paneltype && (
  <SidebarPanel
    type={paneltype}
    title={
      paneltype === "comments"
        ? t("comments")
        : reactionMap[paneltype]?.label
    }
    icon={
      paneltype === "comments"
        ? <FaRegCommentDots />
        : reactionMap[paneltype]?.icon
    }
  /*  items={
      paneltype === "comments"
        ? commentsData
        : users
    }*/
   items={paneltype === "comments" ? staticComment[post.id] || [] : users}
    showFilter={paneltype === "comments"}
    sort={sort}
    setSort={setsort}
    onClose={handleClose}
  />
)}
    </AnimatePresence>
    <Comment post={post}
    onAddComment={handleAddComment } />
    </div>
  )
}

export default PostCard