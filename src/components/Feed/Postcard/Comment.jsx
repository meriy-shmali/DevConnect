import Buttons from '@/components/ui/ButtonGroup'
import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsStars } from "react-icons/bs";
import { motion } from 'framer-motion';
import PostAi from './PostAi';
const Comment = ({post,onAddComment,editingComment,setEditingComment}) => {
  const [text,setText]=useState("")//to add comment
  const{t}=useTranslation()
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
    if (setEditingComment) setEditingComment(null);
  }
  return (
    <div className='flex items-center md:space-x-56 space-x-3'>
    <div className='flex space-x-4 items-center'>
      <img src={post.user?. personal_photo_url||"/images/default avatar1.jpg"}
    className='w-10 h-10 rounded-full '/>
      <input
       placeholder={t('Addcomment')}
      value={text}
      onChange={(e)=>setText(e.target.value)}
      onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enter بدون Shift
      e.preventDefault(); // يمنع السطر الجديد
      handleSend();
    }
  }}
      className=" md:text-lg text-sm w-[400px] border border-gray-300 hover:bg-gray-50 rounded-md  p-2  dark:bg-dark-placeholder  dark:placeholder:text-gray-200"/>
      < IoSend  onClick={handleSend}className='md:text-[30px] text-[25px] text-blue-700 '/>
    </div>
<div className='flex flex-row justify-center space-x-2 items-center border border-follow-button md:w-fit w-full md:py-0.5 md:px-2.5 py-1.5 px-0.5  rounded-3xl cursor-pointer bg-white dark:bg-dark-button'>
  <PostAi id={post.id}/>
</div>
      

    </div>
  )
}

export default Comment