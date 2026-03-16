import React from 'react'
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'

const PostCard = ({post}) => {
  return (
    <div className='bg-white rounded-3xl shadow-xl w-[900px] h-fit p-8 border border-gray-300'>
    <HeaderPost post={post}/>
    <BodyPost post={post} />
    <Reaction post={post} />
    <Comment />
    </div>
  )
}

export default PostCard