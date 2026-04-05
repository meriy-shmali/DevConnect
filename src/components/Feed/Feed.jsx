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
import { Getposts } from '@/hook/UseQueryPost'
const Feed = () => {
const data=Getposts()
 const posts = data?.data || staticposts||[];
  return (
    <>
    <Header/>
    <div className='bg-main-background'>
<div>

</div>
<div className='flex justify-between'>
  <div className='flex-col ml-2 space-y-12'>
  <Choiches />
  //posts
  {staticposts.map((post)=>(
  <PostCard key={post.id} post={post}/>))}
  <Suggestion/>
  </div>
   <Createpost/> 
   {/*<AIAssistant/>*/}
</div>
    </div>
    </>
  )
}

export default Feed