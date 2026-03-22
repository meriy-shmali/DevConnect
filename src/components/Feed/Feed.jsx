import React from 'react'
import Header from './Header'
import Createpost from './Createpost'
import AIAssistant from './AIAssistant'
import { Navigate } from 'react-router-dom'
import Choiches from './Choiches'
import PostCard from './Postcard/PostCard'
import { staticposts } from '@/Utils/data/staticpost'
import { usechoich } from '@/hook/UseQuerychoich';
const Feed = () => {
 
  return (
    <>
    <Header/>
    <div className='bg-main-background'>
<div>

</div>
<div className='flex justify-between'>
  <div className='flex-col ml-2 space-y-12'>
  <Choiches />
  {staticposts.map((post)=>(
  <PostCard key={post.id} post={post}/>))}
  </div>
   <Createpost/> 
   {/*<AIAssistant/>*/}
</div>
    </div>
    </>
  )
}

export default Feed