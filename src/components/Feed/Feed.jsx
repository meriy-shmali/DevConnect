import React, { useState, useEffect, useRef } from "react";
import Createpost from "./Createpost";
import AIAssistant from "./AIAssistant";
import { Navigate } from "react-router-dom";
import Choiches from "./Choiches";
import PostCard from "./Postcard/PostCard";
import { staticposts } from "@/Utils/data/staticpost";
import { usechoich } from "@/hook/UseQuerychoich";
import Suggestion from "./Postcard/Suggestion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UseTheme } from "@/hook/UseTheme";
import InstagramSkeleton from "./Skelton";
import CreatepostMobile from "./CreatepostMobile";

const Feed = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = UseTheme();
  const { t, i18n } = useTranslation();

  const [category, setcategory] = useState("all");
  const [showChoices, setShowChoices] = useState(true);
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [category]);
  const loadMoreRef = useRef(null);
  const lastScrollY = useRef(0);

  // فحص ما إذا كانت اللغة الحالية هي العربية (RTL)
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 10) setShowChoices(false);
      else if (currentScrollY < lastScrollY.current - 10) setShowChoices(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data,
    isLoading,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usechoich(category);

  const allPosts = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    
    <div className="feed-page-bg w-full min-h-screen overflow-x-hidden bg-feed-page-bg dark:bg-feed-page-bg">
      <div className="relative min-h-screen w-full pt-16 md:pt-20">

        {/* زر إنشاء منشور للموبايل — هاد يكفي */}
<div className="md:hidden fixed w-screen flex justify-center py-6 z-50 bg-main-background dark:bg-dark-main-background px-4 -mt-6">
  <div
    onClick={() => navigate("/post-mobile")}
    className="border-2 border-gray-400 w-full max-w-[260px] p-2 rounded-full text-center text-sm font-medium text-gray-500 cursor-pointer dark:text-gray-300 dark:border-gray-300"
  >
    {t("create")}
  </div>
</div>

{/* احذف هاد الـ div ↓ */}
{/* <div className="md:hidden mt-5 px-4 ...">
  <CreatepostMobile />
</div> */}
       

        {/* شريط الخيارات الثابت */}
        <div
          className={`
            fixed md:top-[55px] top-[70px] start-0 end-0 z-10
            flex justify-start px-6 
            transition-all duration-500 ease-in-out
            ${showChoices ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"}
          `}
        >
          <div className="w-full md:max-w-[800px] lg:min-w-full xl:px-20 md:px-4">
            {/* تم تعديل الحاوية هنا لتتوافق مع اتجاهات الـ RTL والـ LTR بشكل ديناميكي */}
            <div className={`bg-main-background  md:pe-5 w-screen relative md:start-0 dark:bg-dark-main-background md:w-[100%] lg:w-[66%] xl:w-[100%] ${isRtl ? "start-3 xl:start-10" : "end-3 xl:end-10"}`}>
              <div className="md:py-2 py-3">
                <Choiches setCategory={setcategory} />
              </div>
            </div>
          </div>
        </div>

        {/* الحاوية الرئيسية للمحتوى */}
        <div className="w-full max-w-[1300px] mx-auto flex flex-row items-start px-4 sm:px-6 lg:px-10">

          {/* 🌟 هنا الحل الذكي للمنشورات:
            بدل تثبيت الـ pe (padding-right)، نستخدم كلاس ديناميكي:
            - في حال العربي (RTL): نترك الفراغ من اليسار ليفسح مجالاً للكارد المتموضع يساراً (lg:ps-[360px] أو lg:pl-[360px]).
            - في حال الإنجليزي (LTR): نترك الفراغ من اليمين (lg:pe-[360px]).
          */}
          <div className={`flex flex-col w-full min-w-0 flex-1 ${isRtl ? "md:pl-[280px] lg:pl-[350px]":"md:pr-[280px] lg:pr-[350px]"}`}>
            <div className="flex flex-col gap-4 mt-24 md:mt-15">
              {isLoading && !isPlaceholderData ? (
                [...Array(3)].map((_, i) => <InstagramSkeleton key={i} />)
              ) : (
                <>
                  {allPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`w-full ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
                    >
                      <PostCard post={post} />
                      {(index + 1) % 6 === 0 && (
                        <div className="w-full mt-4"><Suggestion /></div>
                      )}
                    </div>
                  ))}

                  <div ref={loadMoreRef} className="h-14 w-full flex items-center justify-center">
                    {isFetchingNextPage && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      </div>
                    )}
                    {!hasNextPage && allPosts.length > 0 && (
                      <p className="text-gray-400 text-sm italic py-4">{t("no_more_posts")}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* 🌟 تعديل الكارد الـ fixed ليدعم الاتجاهين:
          - بدلاً من استخدام الخاصية الصارمة right في الـ style، قمنا بتغيير المفتاح ديناميكياً بناءً على اتجاه اللغة.
          - عندما تكون اللغة عربية، يتم الحساب وتطبيق المواصفات على جهة الـ left ليطير الكارد إلى اليسار بشكل متناسق ومبهر.
        */}
        <div
          className="hidden  md:block fixed top-20 xl:top-30 z-20 w-[290px] xl:w-[310px]"
          style={{
            [isRtl ? "left" : "right"]: `max(40px, calc((100vw - 1300px) / 2 + 40px))`,
          }}
        >
          <Createpost />
        </div>

        {/* Createpost للموبايل */}
        

      </div>
    </div>
  );
};

export default Feed;