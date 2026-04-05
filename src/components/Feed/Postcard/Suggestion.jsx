import React from 'react'
import { staticsuggestion } from '@/Utils/data/staticsuggestion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { GoPeople } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useFollow } from '@/hook/UseFollow';
import { useEffect } from 'react';
const Suggestion = ({data}) => {
    const navigate=useNavigate();//للانتقال لصفحة المستخدم
 const [users, setusers] = useState(data || staticsuggestion);

useEffect(() => {
  setusers(data || staticsuggestion);
}, [data]);
    const {followMutation}=useFollow()
      const [startIndex, setStartIndex] = useState(0);
    const visibleUsers = users.slice(startIndex, startIndex + 4);
     const handleFollow=(id,e)=>{
      const previousUsers = users;
        e.stopPropagation();
        setusers((prev)=>prev.filter((u)=>u.id!==id))
          followMutation.mutate(id, {
    onError: () => {
      // رجّع الكارد إذا فشل الطلب
      setusers(previousUsers);
    },
  });
    }
    return (
    <div>
     <div className='text-3xl font-semibold capitalize'>people with same interests like you:</div>
  <div className='flex  items-center mt-8'>
  <div> {startIndex > 0 && (
    <button onClick={() => setStartIndex(prev => prev - 4)}>
      <IoIosArrowBack className='text-[50px] text-gray-400'/>
    </button>
  )} </div>
    
   <AnimatePresence mode="wait">
  <motion.div
    key={startIndex}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
      className={`flex space-x-4 ${
    visibleUsers.length < 4 ? "justify-start" : "justify-center"
  }`}
  >
   <AnimatePresence>
  {visibleUsers.map((user)=>(
     <motion.div
      key={user.id}
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
    <div key={user.id} className='border border-gray-300 p-5 rounded-2xl shadow-xl mb-6 w-[250px] h-fit flex-col space-y-5' onClick={()=>navigate(`/src/components/Feed/ProfilePeople/ProfilePeople.jsx`)} >
    <div className='flex justify-center items-center space-x-3'>
    <div>  <img src={user.avatar} className='w-20 h-20 rounded-full'/></div>
    <div className="w-[120px]"> 
    <p className="font-semibold text-lg capitalize truncate">
      {user.name}
    </p>

    <div className='flex items-center space-x-1 text-lg'>
      <GoPeople />
      <p>{user.followers}</p>
    </div>
  </div>
    </div>
       <div className=" flex-col justify-center items-center space-y-5 ">
              <div className="text-gray-500 text-center text-lg  ">
               {user.speicality?.length > 0 && (
    <div className='flex justify-center capitalize'>
    <div> {user.speicality[0]}</div> 
    <div>  {user.speicality.length > 1 && " ..."}</div>
    </div>
  )}
              </div>
              <div>
            <button
              onClick={(e) => handleFollow(user.id, e)}
              className=" bg-follow-button text-white py-1 rounded-md w-full relative"
            >
              Follow
            </button></div>
            </div>
    </div>
 </motion.div> ))}</AnimatePresence>  </motion.div>
</AnimatePresence>
  <div> {startIndex + 4 < users.length && (
    <button onClick={() => setStartIndex(prev => prev + 4)}>
     <IoIosArrowForward className='text-[50px] text-gray-400'/>
    </button>
  )}</div>
</div>

     
</div>

    
  )
}

export default Suggestion