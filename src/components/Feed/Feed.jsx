import React from 'react'
import Header from './Header'
import Createpost from './Createpost'
import AIAssistant from './AIAssistant'
import { Navigate } from 'react-router-dom'
import Choiches from './Choiches'
import PostCard from './Postcard/PostCard'
import { staticposts } from '@/Utils/data/staticpost'
import { usechoich } from '@/hook/UseQuerychoich';
import Suggestion from './Postcard/Suggestion'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UseTheme } from '@/hook/UseTheme'
import { useEffect,useRef } from 'react'
import InstagramSkeleton from './Skelton'
const Feed = () => {
   const navigate=useNavigate();
   const { theme, setTheme } = UseTheme();
     const { t } = useTranslation();
 const[category,setcategory]=useState('all');
 const loadMoreRef = useRef(null);
const { 
    data, 
    isLoading, 
    isPlaceholderData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usechoich(category);
  const allPosts = data?.pages.flatMap((page) => page.results) || [];
 useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // بمجرد ظهور 10% من العنصر الوهمي، ابدأ التحميل
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("Fetching next page..."); // أضيفي هذا السطر للتأكد في الكونسول
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // أضفنا هامش 100px ليبدأ التحميل قبل أن يصل المستخدم للنهاية تماماً
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
 //const posts = data?.data || staticposts||[];
 //const posts = data || staticposts || []; اذا رجع مصفوفة
 return (
    <div className="dark:bg-dark-main-background">
      <Header theme={theme} setTheme={setTheme} />

      {/* أزلت h-screen لكي يسمح للمحتوى بالتمدد والسكول أن يعمل بشكل طبيعي */}
      <div className="bg-main-background dark:bg-dark-main-background relative min-h-screen mt-16">
        
        {/* زر إنشاء على الموبايل */}
        <div className="md:hidden flex items-center justify-center">
          <div
            onClick={() => navigate("/post-mobile")}
            className="border-2 border-gray-500 mt-16 w-[400px] p-2 rounded-4xl pl-5 text-xl text-gray-500 flex align-middle dark:text-gray-300 dark:border-gray-300"
          >
            {t('create')}
          </div>
        </div>

        <div className="flex items-center justify-between ml-14 ">
          <div className="flex-col space-y-12 md:ml-0 md:w-[60%] ">
            <Choiches setCategory={setcategory} />

            {isLoading && !isPlaceholderData ? (
             <div className="flex flex-col w-full">
    {[...Array(3)].map((_, i) => (
      <InstagramSkeleton key={i} />
    ))}
  </div>
            ) : (
              <>
                {/* نستخدم allPosts التي تحتوي على دمج كل الصفحات */}
                {allPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className={isPlaceholderData ? "opacity-50" : "opacity-100"}
                  >
                    <PostCard post={post} />
                    {index === 0 && <Suggestion />}
                  </div>
                ))}

                {/* --- هذا هو الجزء الجديد (مراقب التحميل) --- */}
                <div ref={loadMoreRef} className="h-20 w-full flex items-center justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    
                    </div>
                  )}
                  {!hasNextPage && allPosts.length > 0 && (
                    <p className="text-gray-400 text-sm italic">{t('no_more_posts')}</p>
                  )}
                </div>
                {/* ------------------------------------------ */}
              </>
            )}
          </div>

          {/* هنا نضيف Createpost ثابت */}
          <div className="hidden md:block">
            <div className="fixed top-32 right-10 w-[400px]">
              <Createpost />
            </div>
          </div>
        </div>

        {/* على الموبايل يبقى طبيعي تحت choices */}
        <div className="md:hidden mt-6 px-4">
          <Createpost />
        </div>
      </div>
    </div>
  );}

export default Feed