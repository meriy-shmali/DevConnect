import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header'; // الهيدر الموجود لديك
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import PostCard from '../Feed/Postcard/PostCard'; // ملف المنشور المنفصل
import { useGetProfile} from '@/hook/useProfileData';

const ProfilePage = ({ userData }) => {
   const { username } = useParams();
   const navigate = useNavigate();
   const isOwner = username === 'me' || !username||String(profile?.id) === String(localStorage.getItem('userId'));
  // طلب واحد فقط
  const { data: profile, isLoading } = useGetProfile(username || 'me');

  // استخراج المنشورات بأمان - نتحقق من وجود profile أولاً ثم الوصول للمصفوفة
  // ريتا قالت أن الرابط يعيد البوستات، لذا غالباً ستكون داخل profile.results أو profile.posts
  const postsArray = profile?.results || profile?.posts || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-9">
      <Header />
      <main className="container mx-auto">
        <ProfileHeader userData={profile} />
        <PersonalInfoCard info={profile} userData={profile}/>
        {isOwner && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-50  max-w-5xl mx-auto justify-items-center  ">
           {Array.isArray(postsArray) && postsArray.length > 0 ? (
           postsArray.map((post) => (
        <div 
         key={post.id} 
         className=" flex justify-center  p-4"
       >
    {/* هنا نستخدم md للتحكم بالأبعاد */}
    <div className="w-full max-w-[460px] md:max-w-[550px] transition-all duration-300 ">
    
    
     <PostCard 
      post={post}
      customWidth="max-w-[500px] w-full" 
      commentClass='scale-90 origin-top text-xs px-4 '
      HeaderClass="flex justify-between items-center w-[112%] -ml-[6%] scale-85 px-0 gap-0 
                   [&>div:first-child]:flex-none [&>div:first-child]:flex [&>div:first-child]:items-center [&>div:first-child]:pl-4 [&>div:first-child]:!w-[300px] [&>div:first-child]:!min-w-[300px] [&>div:first-child]:!flex-none
                   [&>div:first-child>div:first-child]:flex-none [&>div:first-child>div:first-child]:w-[140px] [&>div:first-child>div:first-child]:mr-auto
                   [&>div:first-child>div:first-child>span]:ml-3 
                   [&>div:first-child>div:first-child>div:first-child]:mr-4 [&>div:first-child>div:first-child>div:first-child]:gap-x-3 
                   [&>div:first-child>button]:w-[100px]
                   [&_button:nth-last-of-type(2)]:max-w-[20px] 
                   [&_button]:ml-6
                   [&>div:last-child]:flex-1 [&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:justify-end [&>div:last-child]:gap-x-1 [&>div:last-child]:ml-auto
                   [&>div:last-child>button:first-child]:w-[70px] [&>div:last-child>button:first-child]:px-0
                   [&_div]:space-x-0 [&>div:last-child]:!gap-x-1
                   [&>div:first-child>div:first-child]:!w-[100px]
                   [&>div:first-child>div:first-child]:!min-w-[100px]
                  [&>div:first-child>div:first-child]:!max-w-[100px]
                  [&>div:first-child>div:first-child]:!flex-none
                 "
      bodyClass=" h-[300px] scale-90 origin-top px-4 py-0 mb-[-10px] text-sm overflow-hidden custom-scrollbar  " // تحديد ارتفاع البوست
      reactionClass="md:scale-75 scale-65 origin-center gap-x-1 flex justify-center border-t pt-1 pb-6 mb-[-10px] " // تغيير هوامش التفاعلات
/>
                  </div>
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