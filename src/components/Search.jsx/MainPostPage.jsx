import React, { useState } from 'react';
import Header from '../ChangePassword.jsx/Header';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
import PostPage from './PostPage';
import { useGetSavedPosts } from '@/hook/UseMutationAccount';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const MainPostPage = () => {
      const navigate = useNavigate();
      const { i18n, t } = useTranslation();
      const isRtl = i18n.language === 'ar'; 
      const [page, setPage] = useState(1);
      const { data, isLoading, isError } = useGetSavedPosts(page);
      const totalCount = data?.count || 0; 
  return (
    <div className="min-h-screen bg-main-background dark:bg-dark-background  transition-colors duration-300">
      <Header />
      <main className="  mx-auto py-4 ml-4 mr-8 md:ml-20  mb-8 flex flex-col items-center ">
         <div className="w-full relative flex items-center justify-start pt-10  dark:border-white/10">
           
           {/* زر السهم بتموضع مطلق لكي لا يؤثر على مساحة العنوان */}
           <button 
             onClick={() => navigate('/account')} 
             className="absolute -left-10 md:-left-0 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all group flex-shrink-0"
           >
             {isRtl ? (
               <ArrowRight className="w-10 h-10 md:w-12 text-main-text dark:text-white group-hover:scale-110" />
             ) : (
               <ArrowLeft className="w-10 h-10 md:w-12 text-main-text dark:text-white group-hover:scale-110" />
             )}
           </button>
         </div>
          <PostPage />
           
      </main>
    </div>
  )
}

export default MainPostPage