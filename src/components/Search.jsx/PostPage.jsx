import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PostCard from '../Feed/Postcard/PostCard';
import { useQuery } from '@tanstack/react-query';
import { getPostByIdReq } from '@/api/NotificationApi';
import { useEffect } from 'react';
const PostPage = () => {
   const { id } = useParams();
   const location = useLocation();
   const commentIdToScroll = location.state?.scrollToComment;
   
  // محاولة أخذ البيانات من الـ state إذا جاء المستخدم من صفحة الـ Feed
  const statePost = location.state?.post;

  const { data: fetchedPost, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await getPostByIdReq(id);
      // بناءً على نمط الباك إند عندك، غالباً البيانات تكون داخل response.data
      return response.data; 
    },
    // إذا كان البوست موجود مسبقاً في الـ state، لا تقم بطلب API جديد
    enabled: !!id && !statePost, 
  });

  // تحديد أي بوست سنعرض
  const post = statePost || fetchedPost;
   useEffect(() => {
    // ننتظر حتى يتم تحميل البيانات (البوست والتعليقات)
    if (!isLoading && commentIdToScroll) {
      // تأخير بسيط لضمان رندر التعليقات في المتصفح
      const timer = setTimeout(() => {
        const commentElement = document.getElementById(`comment-${commentIdToScroll}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // إضافة فلاش أو تمييز بصري بسيط (اختياري)
          commentElement.classList.add('highlight-comment');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, commentIdToScroll]);


  if (isLoading) {
     return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="animate-pulse text-lg">Loading post {id}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main-background py-10 flex justify-center">
      <div className="w-full max-w-4xl px-4">
         <PostCard post={post} />
      </div>
    </div>
  );
};

export default PostPage;