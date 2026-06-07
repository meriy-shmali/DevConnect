import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PostCard from '../Feed/Postcard/PostCard';
import { useQuery } from '@tanstack/react-query';
import { getPostByIdReq } from '@/api/NotificationApi';
import { useEffect } from 'react';
import { useTranslation } from "react-i18next";

const PostPage = () => {
   const { t, i18n } = useTranslation();
   const { id } = useParams();
   const location = useLocation();
const commentIdToScroll = location.state?.scrollToComment || new URLSearchParams(location.search).get('comment');
  const statePost = location.state?.post;

  const { data: fetchedPost, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      console.log("Fetching post data for ID:", id); 
      const response = await getPostByIdReq(id);
      return response.data || response; 
    },
    enabled: !!id && !statePost, 
    staleTime: 1000 * 60 * 5, 
  });

  const post = statePost || fetchedPost;
  const [isMobile, setIsMobile] = useState(false);
  
     useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  // إضافة معالجة حالة الخطأ (مهمة جداً)
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="text-red-500">{t('error_loading_post')}</p>
      </div>
    );
  }

  // حالة التحميل: تظهر فقط إذا لم يكن هناك بوست في الـ state وجاري جلب البيانات
  if (isLoading && !statePost) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="animate-pulse text-lg">{t('loading_post')}...</p>
      </div>
    );
  }

  // إذا انتهى التحميل ولم نجد بيانات (بوست غير موجود)
   if (!post) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p>{t('post_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6 md:space-y-8">
        <div className="w-full max-w-[460px] md:max-w-4xl flex flex-col space-y-4 mx-auto">
        <div key={post.id} className=" bg-gray-50 dark:bg-dark-main-background flex justify-center">
        <PostCard 
         removeTopMargin={true}
              post={post}
              scrollToCommentId={commentIdToScroll}
              autoOpenComments={!!commentIdToScroll}
              customWidth={isMobile ? "max-w-[500px] w-full" : undefined} 
              commentClass={isMobile ? ` w-full max-w-[350px] mx-auto scale-85 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                                         [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                                         [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` : undefined}
              HeaderClass={isMobile ? `
                          flex justify-between items-center w-full px-2 py-3 gap-0
    [&>div:first-child]:flex-1 [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:ps-0 [&>div:first-child]:!w-auto [&>div:first-child]:!min-w-0
    [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:!w-[40px] [&>div:first-child>div:first-child]:!min-w-[40px] [&>div:first-child>div:first-child]:me-3 [&>div:first-child>div:first-child]:ms-0
    [&>div:first-child>div:first-child>div:first-child]:ms-0 [&>div:first-child>div:first-child>div:first-child]:gap-x-2
    [&>div:first-child>div:first-child>span]:ms-4
   [&>div:last-child]:flex-none [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-2 [&>div:last-child]:ms-auto
    [&>div:last-child>button:first-child]:w-[75px] [&>div:last-child>button:first-child]:px-1
    [&_div]:space-x-0 [&>div:last-child]:!me-0` : undefined} 
              bodyClass={isMobile ?  "h-[160px] scale-90 origin-top px-4 py-0 mb-[-10px] text-sm overflow-visible custom-scrollbar" : undefined}
              reactionClass={isMobile ? `
    /* 📱 موبايل: جعل الحاوية تأخذ العرض الكامل 100% بدون سكيل خارجي ليلتصق تماماً بالحواف */
    w-full px-2 flex justify-between items-center pt-2 pb-4 border-gray-100
    [&>div]:flex [&>div]:items-center [&>div]:gap-x-2 [&_p]:text-[14px] 
    
    /* 🎯 تعديل حجم الأيقونة التعبيرية فقط ومنع الأزرار من التمدد عشوائياً */
    [&_button_svg]:!w-[16px] [&_button_svg]:!h-[16px] [&_button_svg]:max-w-none
    [&_button]:p-1.5 [&_button]:h-auto [&_button]:w-auto
    
    [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
    [&~div_div]:!max-w-full [&~div_div]:box-border:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
    [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]`  : undefined}
            />
      </div>
    </div>
    </div>
  );
};
export default PostPage;