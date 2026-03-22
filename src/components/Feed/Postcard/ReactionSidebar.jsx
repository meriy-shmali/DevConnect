import React from 'react'
import { staticuser } from '@/Utils/data/staticuser'
import { usequeryreaction } from '@/hook/UseQueryreact'
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { motion,AnimatePresence } from 'framer-motion';
const ReactionSidebar = ({post,type,onClose}) => {
//  const {data}=usequeryreaction(post.id,type)
  const user=staticuser[type]
  return (<>
    <div
  onClick={onClose}
  className="fixed inset-0 z-10"
/>
  
   <motion.div
   onClick={(e) => e.stopPropagation()}
   initial={{ x: 400 }}
  animate={{ x: 0 }}
  exit={{ x: 400 }}
  transition={{ duration: 0.3 }}
  className=" overflow-y-auto fixed right-0 top-2 w-[450px] h-screen bg-white shadow-lg p-4 flex flex-col z-10 mt-16 rounded-bl-2xl rounded-tl-2xl h-max-screen overflow-auto">

  {/* Header */}
  <div className="flex justify-between items-center mb-10">
    <h2 className="text-4xl font-bold capitalize">{type}</h2>
  </div>

  {/* Users */}
  <div className="flex-col space-y-5">

    {user.length === 0 ? (
     <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-4 mt-32 text-3xl'> <div><LiaUserAltSlashSolid className='text-9xl'/></div>
    <div> <p>No user</p></div></div>
    ) : (
      user.map((u) => (
        <div key={u.id} className="flex items-center space-x-3">
          <img
            src={u.avatar}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{u.name}</span>
        </div>
      ))
    )}

  </div>
</motion.div>


</>
  )
}

export default ReactionSidebar