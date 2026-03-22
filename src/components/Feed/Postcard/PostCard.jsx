import React, { useState } from 'react'
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'
import ReactionSidebar from './ReactionSidebar'
import { AnimatePresence } from 'framer-motion'
const PostCard = ({post}) => {
  const [showreaction,setshowreaction]=useState(false);
  const[reactiontype,setreactiontype]=useState(null);
  const handleOpenReaction = (type) => {
  setreactiontype(type);
  setshowreaction(true);
  
};

  return (
    <div className='bg-white rounded-3xl shadow-xl w-[900px] h-fit p-8 border border-gray-300 flex-col space-y-10'>
    <HeaderPost post={post}/>
    <BodyPost post={post} />
    <Reaction post={post}  onOpenReaction={handleOpenReaction}/>
      <AnimatePresence>
      {showreaction&&(
        <ReactionSidebar post={post}
        type={reactiontype} 
        onClose={()=>setshowreaction(false)}/>
      )}
    </AnimatePresence>
    <Comment post={post} />
    </div>
  )
}

export default PostCard