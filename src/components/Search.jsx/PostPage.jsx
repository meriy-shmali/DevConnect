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
   const commentIdToScroll = location.state?.scrollToComment;
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
        <p className="animate-pulse text-lg">{t('loading_post')} {id}...</p>
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
        <div key={post.id} className="md:min-h-screen bg-gray-50 dark:bg-dark-main-background py-10 flex justify-center">
        <PostCard 
              post={post}
              customWidth={isMobile ? "max-w-[500px] w-full" : undefined} 
              commentClass={isMobile ? ` w-full max-w-[350px] mx-auto scale-90 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                                         [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                                         [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` : undefined}
              HeaderClass={isMobile ? `
                          flex justify-between items-center w-[114%] -ms-[7%] scale-85 ps-0 !pe-1 gap-0 
                          [&>div:first-child]:flex-1 [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:ps-0 [&>div:first-child]:!w-auto [&>div:first-child]:!min-w-0
                           
                           {/* الحاوية اليسرى: نجعلها مرنة لمنع انضغاط الصورة */}
                           [&>div:first-child]:flex-1 [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:ps-0 [&>div:first-child]:!w-auto [&>div:first-child]:!min-w-0
                           
                           {/* الصورة (الأفاتار): إلغاء أي هوامش وإجبارها على الالتصاق بأقصى اليسار تماماً */}
                           [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:!w-[50px] [&>div:first-child>div:first-child]:!min-w-[40px] [&>div:first-child>div:first-child]:me-6 [&>div:first-child>div:first-child]:ms-0
                           
                           {/* زيادة المسافة بين الصورة والاسم (العناصر الداخلية للأفاتار والاسم) */}
                           [&>div:first-child>div:first-child>div:first-child]:ms-0 [&>div:first-child>div:first-child>div:first-child]:gap-x-4
                           
                           {/* إزاحة نص الاسم عن الصورة عبر الحشو لليسار */}
                           [&>div:first-child>div:first-child>span]:ms-8
                           
                           {/* زيادة المسافة بين الاسم والأزرار بشكل ملحوظ عن طريق دفع حاوية الأزرار لليمين */}
                           [&>div:first-child>button]:w-[80px] [&>div:first-child>button]:ms-12
                           [&_button:nth-last-of-type(2)]:max-w-[20px] 
                           
                           {/* الحاوية اليمنى (الأزرار): دفعها لأقصى اليمين لترك مسافة واسعة ومريحة بينها وبين الاسم */}
                           [&>div:last-child]:flex-none [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-3 [&>div:last-child]:ms-auto
                           [&>div:last-child>button:first-child]:w-[85px] [&>div:last-child>button:first-child]:px-2
                           [&_div]:space-x-0 [&>div:last-child]:ps-30 [&>div:last-child]:!me-[-20px]` : undefined} 
              bodyClass={isMobile ? "h-[300px] scale-90 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar" : undefined}
              reactionClass={isMobile ? ` w-full max-w-[350px] mx-auto scale-65 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                                         [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                                         [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` : undefined}
            />
      </div>
    </div>
    </div>
  );
};
export default PostPage;