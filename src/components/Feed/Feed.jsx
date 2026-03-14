import React from 'react'
import Header from './Header'
import Createpost from './Createpost'
import AIAssistant from './AIAssistant'
import { Navigate } from 'react-router-dom'
import Choiches from './Choiches'
const Feed = () => {
  return (
    <>
    <Header/>
    <div className='bg-main-background'>
<div>

</div>
<div className='flex justify-between'>
  <Choiches />
   <Createpost/> 
   {/*<AIAssistant/>*/}
</div>
    </div>
    </>
  )
}

export default Feed