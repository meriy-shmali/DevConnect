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
      

  return (
     <div className="min-h-screen bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E]   transition-colors duration-300">
      <Header />
       <main className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-[420px] md:max-w-[900px] flex flex-col items-center space-y-4 md:space-y-6">
          
          <div className="w-full flex items-center justify-start border-gray-200 dark:border-white/10 pb-3 mt-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all group flex-shrink-0 dark:text-gray-50"
                title={t('back')}
              >
                {isRtl ? (
                  <ArrowRight className="w-8 h-8 md:w-9 md:h-9 text-gray-700 dark:text-white group-hover:translate-x-1 duration-200" />
                ) : (
                  <ArrowLeft className="w-8 h-8 md:w-9 md:h-9 text-gray-700 dark:text-white group-hover:-translate-x-1 duration-200" />
                )}
              </button>
    
              <h1 className="title-font text-[40px] md:text-[70px] font-bold self-start mt-8 mb-10 dark:text-gray-50">
                {t('posttt')}
              </h1>
         </div></div>
          <div className="w-full flex justify-center">
          <PostPage 
          data={data} 
              isLoading={isLoading} 
              isError={isError} 
              page={page} 
              setPage={setPage} />
          </div>
        </div>

      </main>
    </div>
  );
};


export default MainPostPage