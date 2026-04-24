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
import { useEffect } from 'react'
const Feed = () => {
   const navigate=useNavigate();

  /*useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, []);*/
   const { theme, setTheme } = UseTheme();
     const { t } = useTranslation();
 const[category,setcategory]=useState('all');
const {data: posts = []}=usechoich(category)
 //const posts = data?.data || staticposts||[];
 //const posts = data || staticposts || []; اذا رجع مصفوفة
  return (
    <div className=' dark:bg-dark-main-background '>
  <Header theme={theme} setTheme={setTheme} />

  <div className='bg-main-background dark:bg-dark-main-background relative h-screen mt-16'>
    
    {/* زر إنشاء على الموبايل */}
    <div className="md:hidden flex items-center justify-center">
      <div
        onClick={()=>navigate("/post-mobile")}
        className="border-2 border-gray-500 mt-16 w-[400px] p-2 rounded-4xl pl-5 text-xl text-gray-500 flex align-middle dark:text-gray-300 dark:border-gray-300"
      >
        {t('create')}
      </div>
    </div>

    <div className='flex items-center justify-between ml-14 mt-5 '>
      
      <div className='flex-col  space-y-12 md:ml-0 md:w-[60%]'>
        <Choiches setCategory={setcategory} />
        {/*posts */}
        {posts.map((post,index)=>(
          <div key={post.id}>
            <PostCard post={post}/>
           {/* {index!==0 && index%1===0 && (<Suggestion/>)}*/} 
           {index === 0 && <Suggestion />}
          </div>
        ))}
      </div>

      {/* هنا نضيف Createpost ثابت */}
      <div className="hidden md:block">
        <div className="fixed top-24 right-10 w-[400px]">
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