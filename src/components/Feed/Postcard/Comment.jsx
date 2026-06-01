import Buttons from '@/components/ui/ButtonGroup'
import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PostAi from './PostAi';

const Comment = ({post, onAddComment, editingComment, setEditingComment, onBestAnswerFound}) => {
  const [text, setText] = useState("")
  const { t } = useTranslation()

  useEffect(() => {
    if (editingComment) setText(editingComment.text);
  }, [editingComment]);

  const handleSend = () => {
    if (!text.trim()) return;
    onAddComment({ postId: post.id, text });
    setText("");
    if (setEditingComment) setEditingComment(null);
  }

  return (
    <div className="flex items-center gap-2">

      {/* صورة المستخدم + input + إرسال */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <img
          src={post.user?.personal_photo_url || "/images/default avatar1.jpg"}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 hidden md:block"
        />
        <input
          placeholder={t('Addcomment')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          className=" w-2/3 text-xs md:text-sm border border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-1.5 dark:bg-dark-placeholder dark:placeholder:text-gray-400 dark:text-gray-100 outline-none focus:border-gray-400 transition-colors"
        />
        <IoSend
          onClick={handleSend}
          className="text-lg md:text-xl text-blue-600 cursor-pointer flex-shrink-0 rtl:scale-x-[-1]"
        />
      </div>

      {/* زر Ask AI */}
      <div className="flex items-center border border-follow-button rounded-3xl py-1.5 px-2 cursor-pointer bg-white dark:bg-dark-button flex-shrink-0">
        <PostAi
          id={post.id}
          content={post.content}
          code={post.code}
          codeLanguage={post.code_language}
          postType={post.post_type}
          onBestAnswerFound={onBestAnswerFound}
        />
      </div>

    </div>
  )
}

export default Comment