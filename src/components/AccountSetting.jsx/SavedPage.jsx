import React, { useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
import SavedPost from './SavedPost';
import { useGetSavedPosts } from '@/hook/UseMutationAccount';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const SavedPage = () => {
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
         <div className="w-full relative flex items-center justify-start pb-4 dark:border-white/10">
  
  {/* زر السهم بتموضع مطلق لكي لا يؤثر على مساحة العنوان */}
  <button 
    onClick={() => navigate('/account')} 
    className="absolute -left-10 md:-left-0 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all group flex-shrink-0 mt-8 mb-3"
  >
    {isRtl ? (
      <ArrowRight className="w-10 h-10 md:w-12 text-main-text dark:text-white group-hover:scale-110" />
    ) : (
      <ArrowLeft className="w-10 h-10 md:w-12 text-main-text dark:text-white group-hover:scale-110" />
    )}
  </button>

          <div className="w-full flex justify-start  ">
          <h1 className="text-[32px] md:text-[48px] font-bold self-start mt-8 mb-3 lg:ml-35 md:ml-30">
          {t('saved_posts')}
          </h1>
          {!isLoading && (
         <div className="flex items-center ml-3 mt-8 mb-3">
           <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400  text-[22px] md:text-[28px] lg:text-[32px] font-bold h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full shadow-lg dark:border-zinc-800">
            {totalCount}
            </span>
         </div>
          )}
        </div>
            </div>
          <SavedPost />
           
      </main>
    </div>
  )
}

export default SavedPage