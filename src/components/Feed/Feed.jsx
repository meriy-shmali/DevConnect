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
const Feed = () => {
   const navigate=useNavigate();
     const { t } = useTranslation();
 const[category,setcategory]=useState('all');
const {data}=usechoich(category)
 //const posts = data?.data || staticposts||[];
 //const posts = data || staticposts || []; اذا رجع مصفوفة
  return (
    <div className='bg-main-background'>
  <Header />

  <div className='bg-main-background relative h-screen'>
    
    {/* زر إنشاء على الموبايل */}
    <div className="md:hidden flex items-center justify-center">
      <div
        onClick={()=>navigate("/post-mobile")}
        className="border-2 border-gray-500 mt-16 w-[400px] p-2 rounded-4xl pl-5 text-xl text-gray-500 flex align-middle"
      >
        {t('create')}
      </div>
    </div>

    <div className='flex items-center justify-between ml-10 mt-5 '>
      
      <div className='flex-col  space-y-12 md:ml-0 md:w-[60%]'>
        <Choiches setCategory={setcategory} />
        {staticposts.map((post,index)=>(
          <div key={post.id}>
            <PostCard key={post.id} post={post}/>
            {index!==0 && index%2===0 && (<Suggestion/>)}
          </div>
        ))}
      </div>

      {/* هنا نضيف Createpost ثابت */}
      <div className="hidden md:block">
        <div className="fixed top-28 right-10 w-[400px]">
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
  )
}

export default Feed