import React, { useState,useRef } from 'react';
import { MoreVertical, ThumbsUp, ThumbsDown, MessageCircle, Share2, Award, Pencil, Trash2 } from 'lucide-react';
import { MdEdit } from 'react-icons/md';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useIsOwner } from '@/hook/UseIsOwner';
import EditPostModal from '../EditPostModal';

const PostCard = ({ post,userData, customWidth }) => {
  const { t } = useTranslation();
  const [showEditMenu,setShowEditMenu]=useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditModalOpen,setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { username: profileUsername } = useParams();
  const loggedInUser = localStorage.getItem('username'); 
  const isOwner = userData?.id === post?.userId;
    const handleEditClick = () => {
      setShowEditMenu(false);
     
    };

  return (
    <div className={`bg-white rounded-[25px] shadow-sm border border-gray-100 p-4 w-full max-w-[450px] rtl text-right relative
    ${customWidth ? customWidth : 'w-full'}`}>
      
      {/* الجزء العلوي: الصورة، الاسم، والتصنيف */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img 
            src={post?.userAvatar || "https://via.placeholder.com/40"} 
            alt="user" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{post?.author || "Ritta7"}</h4>
            <p className="text-[10px] text-gray-400">التاريخ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-gray-50 border border-gray-200 text-gray-600 text-[10px] px-3 py-1 rounded-full">
            التصنيف
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {/* قائمة خيارات التعديل والحذف (تظهر عند الضغط) */}
             {isOwner && showOptions && (
          
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 shadow-2xl rounded-xl z-50 py-1">
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50" onClick={()=>{setIsEditModalOpen(true);setShowOptions(false)}}>
                  <MdEdit className="w-3 h-3 text-blue-500" /> {t('edit')}
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-[12px] text-red-600 hover:bg-red-50 transition-colors" >
                  <Trash2 className="w-3 h-3" /> {t('delete')}
                </button>
              </div>
             )}
          
          </div>
        </div>
      </div>

      {/* محتوى المنشور */}
      <div className="my-6 px-2">
        <p className="text-gray-700 text-sm leading-relaxed text-center">
          {post?.content || "منشور نصي ينزلو المستخدم"}
        </p>
      </div>

      {/* شريط التفاعل */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <MessageCircle className="w-4 h-4" /> <span>1k</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <ThumbsUp className="w-4 h-4" /> <span>1k</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <ThumbsDown className="w-4 h-4" /> <span>20</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <Share2 className="w-4 h-4" /> <span>3</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <Award className="w-4 h-4" /> <span>3</span>
          </div>
        </div>
      </div>

      {/* صندوق إضافة تعليق */}
      <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
        <img 
          src="https://via.placeholder.com/25" 
          className="w-6 h-6 rounded-full" 
          alt="me" 
        />
        <input 
          type="text" 
          placeholder="Add comment" 
          className="bg-transparent border-none outline-none text-[11px] w-full py-1 text-right"
        />
        {isEditModalOpen && (
         <EditPostModal
                initialText={post.content}
                onClose={() => setIsEditModalOpen(false)} 
                postData={post}
                onSave={(newContent)=>{setIsEditModalOpen(false)}}
                isLoading={false} 
              />)}
      </div>
    </div>
  );
};

export default PostCard;