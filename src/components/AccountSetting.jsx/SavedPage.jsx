import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from "react-i18next";
import SavedPost from './SavedPost';
import { useGetSavedPosts } from '@/hook-temp/UseMutationAccount';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SavedPage = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar'; 
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isError } = useGetSavedPosts(page);
  const totalCount = data?.count || 0; 

  return (
    <div className="h-full bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E] transition-colors duration-300 mt-12">
      <main className="w-full mx-auto px-2 sm:px-4 md:px-4 py-4 md:py-6 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-[420px] md:max-w-[900px] flex flex-col items-center space-y-4 md:space-y-6">
          
          {/* 🌟 هيدر الصفحة: تم ضبط المحاذاة الكاملة عبر items-center وتنظيف المارجن الخارجي الزائد */}
          <div className="w-full flex items-center justify-start border-gray-200 dark:border-white/10 pb-3 mt-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap md:flex-nowrap">
              
              {/* زر العودة */}
              <button 
                onClick={() => navigate('/account')} 
                className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-all group flex-shrink-0 dark:text-gray-50"
                title={t('back')}
              >
                {isRtl ? (
                  <ArrowRight className="w-5 h-5 md:w-7 md:h-7 text-gray-700 dark:text-white group-hover:translate-x-1 duration-200" />
                ) : (
                  <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 text-gray-700 dark:text-white group-hover:-translate-x-1 duration-200" />
                )}
              </button>
      
              {/* عنوان الصفحة: تم حذف mt-8 و mt-12 و self-start ليبقى موازياً للزر تماماً */}
              <h1 className="title-font text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold dark:text-gray-50 leading-none">
                {t('saved_posts')}
              </h1>
            
              {/* دائرة العداد الرقمي */}
              {!isLoading && (
                <span className="dark:bg-gray-800 px-2 py-0.5 text-xs font-bold
                  inline-flex items-center justify-center bg-gray-100 text-gray-600 dark:bg-zinc-800
                  dark:text-gray-400 text-base md:text-xl md:h-10 md:w-10 h-7 w-7 rounded-full 
                  shadow-sm flex-shrink-0 leading-none">
                  {totalCount.toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                </span>
              )}

            </div> 
          </div>

          {/* مساحة عرض المنشورات */}
          <div className="w-full flex justify-center flex-shrink-0"> {/* تم نقل flex-shrink-0 إلى هنا داخل الـ className */}
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