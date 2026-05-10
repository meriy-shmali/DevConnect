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
  const statePost = location.state?.post;

  const { data: fetchedPost, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      console.log("Fetching post data for ID:", id); // للتأكد من بدء الطلب
      const response = await getPostByIdReq(id);
      
      // التعديل هنا: الباك إند عندك غالباً يرسل البيانات مباشرة أو داخل response.data
      // بناءً على تجاربنا السابقة، جربي إرجاع response مباشرة إذا كان الأكسيوس مهيأ لذلك
      return response.data || response; 
    },
    // التعديل الجوهري: اجعل الطلب يعمل دائماً إذا لم يكن لدينا statePost
    enabled: !!id && !statePost, 
    staleTime: 1000 * 60 * 5, // اختياري: تخزين مؤقت لـ 5 دقائق
  });

  // تحديد البوست: إذا فشل الـ state، نأخذ الـ fetchedPost
  const post = statePost || fetchedPost;

  // إضافة معالجة حالة الخطأ (مهمة جداً)
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="text-red-500">Error loading post. Please try again.</p>
      </div>
    );
  }

  // حالة التحميل: تظهر فقط إذا لم يكن هناك بوست في الـ state وجاري جلب البيانات
  if (isLoading && !statePost) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="animate-pulse text-lg">Loading post {id}...</p>
      </div>
    );
  }

  // إذا انتهى التحميل ولم نجد بيانات (بوست غير موجود)
   if (!post) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p>Post not found.</p>
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