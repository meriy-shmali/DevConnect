import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header'; // الهيدر الموجود لديك
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import PostCard from '../Feed/Postcard/PostCard'; // ملف المنشور المنفصل
import { useGetProfile, useGetUserPosts } from '@/hook/useProfileData';

const ProfilePage = () => {
  const { username } = useParams();
  const { data: profile, isLoading: loadingProfile } = useGetProfile(username);
  const { data: posts, isLoading: loadingPosts } = useGetUserPosts(username);
  
 
 // if (loadingProfile || loadingPosts) return <div className="text-center mt-20">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-9">
      <Header />
      <main className="container mx-auto">
        <ProfileHeader userData={profile} />
        <PersonalInfoCard info={profile} userIdFromApi={profile?.id||'user_abc_123'}/>
        
        {/* عرض المنشورات بجانب بعضها في الشاشات الكبيرة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  max-w-4xl mx-auto justify-items-center  ">
         {posts?.map((post) => (
  <div key={post.id} className="w-[450px] h-[350px] overflow-hidden border rounded-xl mb-6">
    <div className='origin-top scale-[1]'>
     <PostCard post={post} />
  </div>
  </div>
))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;