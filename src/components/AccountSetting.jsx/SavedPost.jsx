import React, { useState } from 'react';
import PostCard from '../Feed/Postcard/PostCard';
import { useGetSavedPosts } from '@/hook/UseMutationAccount';
const SavedPost = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetSavedPosts(page);
  const totalCount = data?.count || 0; 
  const savedPosts = data?.results || [];

 
  // معالجة حالة التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="animate-pulse text-lg">Loading saved posts...</p>
      </div>
    );
  }

  // معالجة حالة الخطأ
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        <p className="text-red-500">Error loading saved posts.</p>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main-background py-10 flex justify-center">
      <div className="w-full max-w-4xl px-4 space-y-6">
        
          
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center dark:text-white py-20">
             <p className="text-xl">You haven't saved any posts yet.</p>
          </div>
        )}

        {/* أزرار الترقيم (إذا كان هناك صفحات أخرى) */}
        {data?.next || data?.previous ? (
           <div className="flex justify-center gap-4 mt-8">
              <button 
                disabled={!data?.previous}
                onClick={() => setPage(old => old - 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                Previous
              </button>
              <button 
                disabled={!data?.next}
                onClick={() => setPage(old => old + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                Next
              </button>
           </div>
        ) : null}
      </div>
    </div>
  );
};

export default SavedPost;