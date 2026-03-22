import Buttons from '@/components/ui/ButtonGroup'
import React from 'react'
import { IoSend } from "react-icons/io5";

const Comment = ({post}) => {
  return (
    <div className='flex space-x-4 items-center'>
      <img src={post.user?.avatar}
    className='w-10 h-10 rounded-full'/>
      <input placeholder='Add Comment'
      className=" w-[400px] border border-gray-300 rounded-md p-2 "/>
      {/*<Buttons type='send'/>*/}
      < IoSend className='text-[30px] text-blue-700'/>
    </div>
  )
}

export default Comment