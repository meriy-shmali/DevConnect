import Buttons from '@/components/ui/ButtonGroup'
import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useEffect } from 'react';
const Comment = ({post,onAddComment,editingComment,setEditingComment}) => {
  const [text,setText]=useState("")//to add comment
  useEffect(() => {
    if (editingComment) {
      setText(editingComment.text);
    }
  }, [editingComment]);
  const handleSend=()=>{
    //منع التعليقات الفارغة
    if (!text.trim())return;
    //لتمرير التعليق للاب
    onAddComment({
      postId: post.id,   // ✅ أهم تعديل
      text: text,
      // للتعديل لاحقًا
    });
    setText("");
    setEditingComment(null);
  }
  return (
    <div className='flex space-x-4 items-center'>
      <img src={post.user?. personal_photo_url}
    className='w-10 h-10 rounded-full'/>
      <input placeholder='Add Comment'
      value={text}
      onChange={(e)=>setText(e.target.value)}
      onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enter بدون Shift
      e.preventDefault(); // يمنع السطر الجديد
      handleSend();
    }
  }}
      className=" md:text-lg text-sm w-[400px] border border-gray-300 rounded-md  p-2  dark:bg-gray-100"/>
      < IoSend  onClick={handleSend}className='md:text-[30px] text-[25px] text-blue-700 '/>
    </div>
  )
}

export default Comment