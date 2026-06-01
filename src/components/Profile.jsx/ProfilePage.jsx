import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import PostCard from '../Feed/Postcard/PostCard'; // ملف المنشور المنفصل
import { useGetProfile} from '@/hook/useProfileData';

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" w-screen bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E]   transition-colors duration-300">
      
      <main className="container mx-auto">
        <ProfileHeader userData={profile} />
        <PersonalInfoCard info={profile} userData={profile}/>
        
        {isOwner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8  max-w-5xl mx-auto justify-items-center w-full px-4 md:px-0 ">
            {Array.isArray(postsArray) && postsArray.length > 0 ? (
              postsArray.map((post) => (
                <div 
                  key={post.id} 
                  className="w-full max-w-[460px] md:max-w-4xl flex flex-col space-y-4 mx-auto"
                >
    
    
    
     <PostCard 
      post={post}
      compact={true}
       customWidth={isMobile ? "max-w-[500px] w-full" : "max-w-[500px] w-full" }
      commentClass={isMobile ? ` w-full max-w-[350px] mx-auto scale-90 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                                         [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                                         [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` : `scale-90 origin-top text-xs px-4 `}
      HeaderClass={isMobile ? `
                          flex justify-between items-center w-[114%] -ms-[7%] scale-90 ps-0 !pe-1 gap-0 
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
                           [&_div]:space-x-0 [&>div:last-child]:ps-30 [&>div:last-child]:!me-[-20px]` :`flex justify-between items-center w-[112%] -ml-[6%] scale-85 px-0 gap-0 
                   [&>div:first-child]:flex-none [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:pl-4 [&>div:first-child]:!w-[300px] [&>div:first-child]:!min-w-[300px] [&>div:first-child]:!flex-none
                   [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:w-[140px] [&>div:first-child>div:first-child]:mr-auto
                   [&>div:first-child>div:first-child>span]:ml-3 
                   [&>div:first-child>div:first-child>div:first-child]:mr-4 [&>div:first-child>div:first-child>div:first-child]:gap-x-3 
                   [&>div:first-child>button]:w-[100px]
                   [&_button:nth-last-of-type(2)]:max-w-[20px] 
                   [&_button]:ml-6
                   [&>div:last-child]:flex-1 [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-1 [&>div:last-child]:ml-20
                   [&>div:last-child>button:first-child]:w-[70px] [&>div:last-child>button:first-child]:px-0
                   [&_div]:space-x-0 [&>div:last-child]:!gap-x-1
                   [&>div:first-child>div:first-child]:!w-[100px]
                   [&>div:first-child>div:first-child]:!min-w-[100px]
                  [&>div:first-child>div:first-child]:!max-w-[100px]
                  [&>div:first-child>div:first-child]:!flex-none
                 `}
      bodyClass={
  isMobile
    ? "h-[300px] scale-90 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar"
    : "h-[180px] scale-100 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar"
}
      reactionClass={isMobile ? ` w-full max-w-[350px] mx-auto scale-65 origin-center gap-x-0.5 flex justify-center border-t pt-1 pb-6 mb-[-10px] 
                                         [&~div]:!max-w-[320px] [&~div]:!w-full [&~div]:mx-auto 
                                         [&~div_div]:!max-w-full [&~div_div]:box-border [&_.._div]:max-w-[320px]` :`md:scale-90 scale-65 origin-center gap-x-1 flex justify-between  pt-1 pb-6 mb-[-10px] `} // تغيير هوامش التفاعلات
/>
                  </div>
               
              ))
            ) : (
              <div className="text-gray-500"></div>
            )}
          </div>
        )} 
      </main>
    </div>
  );
};

export default ProfilePage;