import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PostCard from '../Feed/Postcard/PostCard';
import InstagramSkeleton from '../Feed/Skelton';

const SavedPost = ({ data, isLoading, isError, page, setPage }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const savedPosts = data?.results || [];
  const itemsPerPage = 10;
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col space-y-4 md:space-y-6 animate-pulse px-2 sm:px-0">
        <InstagramSkeleton />
        <InstagramSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-12 px-4">
        <p className="text-red-500 font-semibold text-lg md:text-xl">
          {t('something_went_wrong')}
        </p>
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl md:rounded-3xl">
        <p className="text-gray-400 dark:text-zinc-500 text-lg md:text-xl font-medium text-center">
          {t('no_saved_posts')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6 md:space-y-8">
      {/* 🌟 تم تحديد الحد الأقصى للعرض بـ [640px] للحصول على مقاس كارد احترافي ومريح للعين */}
      <div className="w-full max-w-[460px] md:max-w-[640px] flex flex-col space-y-6 mx-auto px-2 sm:px-0">
        {savedPosts.map((post) => (
          /* 💡 تم التخلص من md:min-h-screen وتعديل الهوامش ليأخذ الكارد حجمه الطبيعي تماماً */
          <div key={post.id} className="w-full h-auto bg-transparent flex justify-center transition-all duration-200">
            <PostCard 
              post={post}
              customWidth="w-full" 
              commentClass={isMobile ? `w-full max-w-[350px] mx-auto scale-95 origin-center gap-x-0.5 flex justify-between pt-1 pb-6 mb-[-10px] 
                ` : undefined}
              // تصحيح التنسيق: جعلنا العرض حقيقي ومستقر w-full بدلاً من التمدد خارج الكارد
              HeaderClass={isMobile ? `flex justify-between items-center w-full scale-95 origin-center gap-2 ps-0 pe-1 
                [&>div:first-child]:flex-1 [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:ps-0 [&>div:first-child]:!w-auto [&>div:first-child]:!min-w-0
                [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:!w-[50px] [&>div:first-child>div:first-child]:!min-w-[40px] [&>div:first-child>div:first-child]:me-6 [&>div:first-child>div:first-child]:ms-0
                [&>div:first-child>div:first-child>div:first-child]:ms-0 [&>div:first-child>div:first-child>div:first-child]:gap-x-4
                [&>div:first-child>div:first-child>span]:ms-8
                [&>div:first-child>button]:w-[80px] [&>div:first-child>button]:ms-12
                [&_button:nth-last-of-type(2)]:max-w-[20px] 
                [&>div:last-child]:flex-none [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-3 [&>div:last-child]:ms-auto
                [&>div:last-child>button:first-child]:w-[85px] [&>div:last-child>button:first-child]:px-2
                [&_div]:space-x-0 [&>div:last-child]:ps-30 [&>div:last-child]:!me-[-20px]` : undefined} 
              bodyClass={isMobile ? "h-[300px] scale-95 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar" : "w-full text-base"}
              reactionClass={isMobile ? `w-full max-w-[350px] mx-auto scale-95 origin-center gap-x-0.5 flex justify-between  pb-6 mb-[-10px] 
                [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` : undefined}
            />
          </div>
        ))}
      </div>

      {/* 🌟 شريط التحكم بالصفحات (Pagination) */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-center gap-2 sm:gap-4 pt-6 pb-10 w-full max-w-[640px] border-t border-gray-100 dark:border-white/5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition duration-200 text-xs sm:text-sm font-medium flex-shrink-0 cursor-pointer"
          >
            {t('previous')}
          </button>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-sm">
              {page}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('of')} {totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : prev))}
            disabled={page === totalPages}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition duration-200 text-xs sm:text-sm font-medium flex-shrink-0 cursor-pointer"
          >
            {t('next')}
          </button>

        </div>
      )}
    </div>
  );
};

export default SavedPost;