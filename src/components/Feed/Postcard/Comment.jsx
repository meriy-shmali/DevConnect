import Buttons from '@/components/ui/ButtonGroup'
import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";

const Comment = ({post,onAddComment}) => {
  const [text,setText]=useState("")//to add comment
  const handleSend=()=>{
    //منع التعليقات الفارغة
    if (!text.trim())return;
    //لتمرير التعليق للاب
    onAddComment(text);
    setText("")
  }
  return (
    <div className='flex space-x-4 items-center'>
      <img src={post.user?.avatar}
    className='w-10 h-10 rounded-full'/>
      <input placeholder='Add Comment'
      value={text}
      onChange={(e)=>setText(e.target.value)}
      className=" w-[400px] border border-gray-300 rounded-md p-2 "/>
      < IoSend  onClick={handleSend}className='text-[30px] text-blue-700 '/>
    </div>
  )
}

export default Comment