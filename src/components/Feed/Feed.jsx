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
  const { t } = useTranslation();

  const [category, setcategory] = useState("all");
  const [showChoices, setShowChoices] = useState(true);

  const loadMoreRef = useRef(null);
  const lastScrollY = useRef(0);

  // إخفاء وإظهار الـ Choices عند السكرول
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // نزول
      if (currentScrollY > lastScrollY.current + 10) {
        setShowChoices(false);
      }

      // طلوع
      else if (currentScrollY < lastScrollY.current - 10) {
        setShowChoices(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    data,
    isLoading,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usechoich(category);

  const allPosts =
    data?.pages.flatMap((page) => page.results) || [];

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div className="feed-page-bg w-full min-h-screen overflow-x-hidden bg-feed-page-bg dark:bg-feed-page-bg">

      <div className="relative min-h-screen w-full pt-16 md:pt-20">

        {/* زر إنشاء منشور للموبايل */}
        <div className="md:hidden fixed w-screen flex justify-center py-6 z-50 bg-main-background px-4  -mt-6">
          <div
            onClick={() => navigate("/post-mobile")}
            className="border-2 border-gray-400 w-full max-w-[260px] p-2 rounded-full text-center text-sm font-medium text-gray-500 cursor-pointer dark:text-gray-300 dark:border-gray-300"
          >
            {t("create")}
          </div>
        </div>

        {/* شريط الخيارات الثابت */}
        <div
          className={`
            fixed md:top-[55px] top-[70px] left-0 right-0 z-10
            flex justify-start px-6
            transition-all duration-500 ease-in-out
            ${
              showChoices
                ? "translate-y-0 opacity-100"
                : "-translate-y-24 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="w-full md:max-w-[700px] md:px-4 me-4">
            <div className="bg-main-background w-screen relative right-3 md:right-0 dark:bg-dark-main-background  md:w-fit">
              <div className="md:py-2 py-3 ">
                <Choiches setCategory={setcategory} />
              </div>
            </div>
          </div>
        </div>

        {/* الحاوية الرئيسية */}
        <div className="w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row justify-between items-start px-4 sm:px-5 lg:px-10 gap-x-16 xl:gap-12">

          {/* عمود المنشورات */}
          <div className="flex flex-col w-full lg:max-w-[640px] xl:max-w-[700px] flex-1 min-w-0">

            {/* المنشورات */}
            <div className="flex flex-col gap-4 mt-24 md:mt-15">

              {isLoading && !isPlaceholderData ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <InstagramSkeleton key={i} />
                  ))}
                </>
              ) : (
                <>
                  {allPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`w-full ${
                        isPlaceholderData
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                    >
                      <PostCard post={post} />

                      {(index + 1) % 6 === 0 && (
                        <div className="w-full mt-4">
                          <Suggestion />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Load More */}
                  <div
                    ref={loadMoreRef}
                    className="h-14 w-full flex items-center justify-center"
                  >
                    {isFetchingNextPage && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                    )}

                    {!hasNextPage &&
                      allPosts.length > 0 && (
                        <p className="text-gray-400 text-sm italic py-4">
                          {t("no_more_posts")}
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Createpost للشاشات الكبيرة */}
          <div className="hidden  me-5 lg:flex w-[280px] xl:w-[300px] flex-shrink-0 fixed  lg:end-10 top-20 self-start h-fit">
            <Createpost />
          </div>
        </div>

        {/* Createpost للموبايل */}
       {/* Createpost للموبايل */}
<div className="lg:hidden  mt-5 px-4 w-full max-w-[480px] mx-auto">
  <CreatepostMobile />
</div>
      </div>
    </div>
  );
};

export default Feed;