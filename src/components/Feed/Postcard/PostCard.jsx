import React, { useState } from 'react'
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'
import SidebarPanel from './Sidepanel'
import { staticuser } from '@/Utils/data/staticuser'
import { AnimatePresence } from 'framer-motion'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { PiBugBeetle } from "react-icons/pi";
import { MdLightbulbOutline } from "react-icons/md";
import { usequeryreaction } from '@/hook/UseQueryreact'
const PostCard = ({post}) => {
 const [showreaction,setshowreaction]=useState(false);
  const[reactiontype,setreactiontype]=useState(null);
  const handleOpenReaction = (type) => {
  setreactiontype(type);
  setshowreaction(true);
};
const handleClose = () => {
  setshowreaction(false)
};
const { data } = usequeryreaction(post.id, reactiontype);
const users = data?.length ? data : staticuser[reactiontype] || [];
const reactionData = [
  { key: "likes", label: "useful", count: post.likes, icon: <AiOutlineLike /> },
  { key: "dislikes", label: "not useful", count: post.dislikes, icon: <AiOutlineDislike /> },
  { key: "problem", label: "same problem", count: post.problem, icon: <PiBugBeetle /> },
  { key: "ideas", label: "creative solution", count: post.ideas, icon: <MdLightbulbOutline /> }
];
const reactionMap = Object.fromEntries(
  reactionData.map(item => [item.key, item])
);
  return (
    <div className='bg-white rounded-3xl shadow-xl w-[900px] h-fit p-8 border border-gray-300 flex-col space-y-10'>
    <HeaderPost post={post}/>
    <BodyPost post={post} />
    <Reaction post={post}  onOpenReaction={handleOpenReaction} onClose={handleClose} reactionData={reactionData}/>
      <AnimatePresence>
      {showreaction && (
  <SidebarPanel
  type={reactiontype}
    title={reactionMap[reactiontype]?.label}
    icon={reactionMap[reactiontype].icon}
    items={users}
    showFilter={false}
    onClose={handleClose}
  />
)}
    </AnimatePresence>
    <Comment post={post} />
    </div>
  )
}

export default PostCard