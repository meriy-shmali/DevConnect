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
    <div className='flex items-center md:gap-56 gap-9'>
    <div className='flex gap-4 items-center'>
      <img src={post.user?. personal_photo_url||"/images/default avatar1.jpg"}
    className='md:w-10 md:h-10 md:block hidden rounded-full '/>
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
      className=" md:text-lg text-xs md:w-[400px] max-w-full border border-gray-300 hover:bg-gray-50 rounded-md  p-2  dark:bg-dark-placeholder  dark:placeholder:text-gray-200"/>
      < IoSend  onClick={handleSend}className='md:text-[30px] text-[20px] text-blue-700 rtl:scale-x-[-1]'/>
    </div>
<div className='flex flex-row justify-center md:gap-2 items-center border border-follow-button md:w-fit w-fit md:py-0.5 md:px-2.5 py-1 px-2  rounded-4xl   md:rounded-3xl cursor-pointer bg-white dark:bg-dark-button'>
  <PostAi id={post.id} content={post.content} code={post.code} 
         codeLanguage={post.code_language}/>
</div>
      

    </div>
  )
}

export default Comment