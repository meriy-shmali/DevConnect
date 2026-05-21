import React, { useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom'; 
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
    <div className="min-h-screen bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E]   transition-colors duration-300">
      <Header />
      
      {/* تعديل الـ padding الجانبي هنا ليناسب الشاشات الصغيرة جداً */}
      <main className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-[420px] md:max-w-[900px] flex flex-col items-center space-y-4 md:space-y-6">
          
          <div className="w-full flex items-center justify-start border-gray-200 dark:border-white/10 pb-3 mt-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => navigate('/account')} 
                className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all group flex-shrink-0 dark:text-gray-50"
                title={t('back')}
              >
                {isRtl ? (
                  <ArrowRight className="w-8 h-8 md:w-9 md:h-9 text-gray-700 dark:text-white group-hover:translate-x-1 duration-200" />
                ) : (
                  <ArrowLeft className="w-8 h-8 md:w-9 md:h-9 text-gray-700 dark:text-white group-hover:-translate-x-1 duration-200" />
                )}
              </button>
      
              {/* تصغير حجم خط العنوان على الهواتف الصغيرة */}
              <h1 className="title-font text-[40px] md:text-[70px] font-bold self-start mt-8 mb-10 dark:text-gray-50">
                {t('saved_posts')}
              </h1>
           

            {!isLoading && (
              <span className=" dark:bg-gray-800 px-2 py-0.5 text-xs font-bold
              inline-flex items-center justify-center bg-gray-100 text-gray-600 dark:bg-zinc-800
               dark:text-gray-400 text-xl md:text-3xl font-bold md:h-15 md:w-15 h-10 w-10 rounded-full 
               shadow-sm flex-shrink-0">
               {totalCount.toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
              </span>
            )}
          </div> </div>

          <div className="w-full flex justify-center">
            <SavedPost 
              data={data} 
              isLoading={isLoading} 
              isError={isError} 
              page={page} 
              setPage={setPage} 
            />
          </div>
        </div>

      </main>
    </div>
  );
};

export default SavedPage;