import React from 'react'
import Header from './Header'
import Createpost from './Createpost'
import AIAssistant from './AIAssistant'
import { Navigate } from 'react-router-dom'
const Feed = () => {
  return (
    <>
    <Header/>
    <div className='bg-main-background'>
<div>

</div>
<div>
   <Createpost/> 
   {/*<AIAssistant/>*/}
</div>
    </div>
    </>
  )
}

export default Feed