import React from 'react'
import { FaFire } from "react-icons/fa6";
import { motion } from 'framer-motion';
const Trending = ({post}) => {
     
  return (
 <>
 {post.suggestion_reason!=="Following"&&(
   <motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
  className="flex items-center space-x-2 px-4 py-1.5 w-fit
  text-white rounded-xl shadow-[0_0_15px_rgba(120,60,150,0.5)]"
   style={{
    background:
      "linear-gradient(140deg, #5a7ca0 0%, #7a6bb0 20%, #9b3a98 45%, #c45a6d 70%, #b8a89a 100%)"
  }}>   
  <span>{post.suggestion_reason}</span>
</motion.div>)}</>
  )
}

export default Trending