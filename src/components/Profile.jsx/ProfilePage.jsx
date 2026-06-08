import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import PostCard from '../Feed/Postcard/PostCard'; // ملف المنشور المنفصل
import { useGetProfile } from '@/hook/UseProfileData';

const ProfilePage = ({ userData }) => {
   const navigate = useNavigate();
   const { id } = useParams();
   const profileTarget = id || 'me';
   const { data: profile, isLoading } = useGetProfile(profileTarget);
   const isOwner = profileTarget === 'me' || String(profile?.id) === String(localStorage.getItem('userId'));
   const postsArray = profile?.results || profile?.posts || [];
   const [isMobile, setIsMobile] = useState(false);
     
   useEffect(() => {
     const handleResize = () => {
       setIsMobile(window.innerWidth < 768);
     };
     handleResize();
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:mt-12 mt-8 md:px-4 bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E] transition-colors duration-300">
      
      <main className="container mx-auto">
        <ProfileHeader userData={profile} />
        <PersonalInfoCard info={profile} userData={profile}/>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 md:gap-y-8 gap-x-8 max-w-5xl mx-auto justify-items-center w-full px-4 md:px-0">
          {Array.isArray(postsArray) && postsArray.length > 0 ? (
            postsArray.map((post) => (
              <div 
                key={post.id} 
               
                className="w-full max-w-[460px] md:max-w-4xl flex flex-col space-y-4 mx-auto overflow-visible relative"
              >
                <PostCard 
                  post={post}
                   onBodyClick={() => navigate(`/post/${post.id}`, { state: { post } })}
                  isInProfilePage={true}
                  compact={true}
                  customWidth={isMobile ? "w-full" : "max-w-[500px] w-full"}
                  commentClass={isMobile ? `w-full max-w-[350px] mx-auto scale-90 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                    [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                    [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` 
                    : `scale-90 origin-top text-xs px-4`}
                  HeaderClass={isMobile ? `
                    flex justify-between items-center w-full px-2 py-3 gap-0
                    [&>div:first-child]:flex-1 [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:ps-0 [&>div:first-child]:!w-auto [&>div:first-child]:!min-w-0
                    [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:!w-[40px] [&>div:first-child>div:first-child]:!min-w-[40px] [&>div:first-child>div:first-child]:me-3 [&>div:first-child>div:first-child]:ms-0
                    [&>div:first-child>div:first-child>div:first-child]:ms-0 [&>div:first-child>div:first-child>div:first-child]:gap-x-2
                    [&>div:first-child>div:first-child>span]:ms-4
                    [&>div:first-child>button]:w-[70px] [&>div:first-child>button]:ms-4
                    [&_button:nth-last-of-type(2)]:max-w-[20px] 
                    [&>div:last-child]:flex-none [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-2 [&>div:last-child]:ms-auto
                    [&>div:last-child>button:first-child]:w-[75px] [&>div:last-child>button:first-child]:px-1
                    [&_div]:space-x-0 [&>div:last-child]:!me-0` 
                    : `flex justify-between items-center w-[110%] -ml-[6%] scale-85 px-0 gap-0 
                    [&>div:first-child]:flex-none [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:pl-4 [&>div:first-child]:!w-[300px] [&>div:first-child]:!min-w-[300px] [&>div:first-child]:!flex-none
                    [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:w-[140px] [&>div:first-child>div:first-child]:mr-auto
                    [&>div:first-child>div:first-child>span]:ml-3 
                    [&>div:first-child>div:first-child>div:first-child]:mr-4 [&>div:first-child>div:first-child>div:first-child]:gap-x-3 
                    [&>div:first-child>button]:w-[100px]
                    [&_button:nth-last-of-type(2)]:max-w-[20px] 
                    [&_button]:ms-5
                    [&>div:last-child]:flex-1 [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-1 [&>div:last-child]:ml-20
                    [&>div:last-child>button:first-child]:w-[70px] [&>div:last-child>button:first-child]:px-0
                    [&_div]:space-x-0 [&>div:last-child]:!gap-x-1
                    [&>div:first-child>div:first-child]:!w-[100px]
                    [&>div:first-child>div:first-child]:!min-w-[100px]
                    [&>div:first-child>div:first-child]:!max-w-[100px]
                    [&>div:first-child>div:first-child]:!flex-none`}
                  bodyClass={isMobile
                    ? "h-[160px] scale-90 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar"
                    : "h-[180px] scale-100 origin-top px-4 py-4 mb-[-10px] text-sm overflow-hidden custom-scrollbar"}
                  reactionClass={isMobile ? `
                    /* 📱 موبايل: جعل الحاوية تأخذ العرض الكامل 100% */
                    w-full px-2 flex justify-between items-center pt-2 pb-4 border-gray-100
                    [&>div]:flex [&>div]:items-center [&>div]:gap-x-2 [&_p]:text-[14px] 
                    
                    /* 🎯 تعديل حجم الأيقونة التعبيرية فقط ومنع الأزرار من التمدد عشوائياً */
                    [&_button_svg]:!w-[16px] [&_button_svg]:!h-[16px] [&_button_svg]:max-w-none
                    [&_button]:p-1.5 [&_button]:h-auto [&_button]:w-auto
                    
                    [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                    [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` 
                    : `md:scale-100 scale-65 origin-center gap-x-10 px-0 flex justify-between pt-1 pb-6 mb-[-10px]`}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500"></div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;