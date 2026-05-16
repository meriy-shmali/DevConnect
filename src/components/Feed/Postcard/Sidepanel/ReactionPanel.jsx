import React from 'react'
import { AiOutlineDislike,AiOutlineLike } from 'react-icons/ai';
import { motion } from "framer-motion"; 

const ReactionPanel = ({ id, counts, handleReaction }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1 dark:text-gray-200">
        <p className='text-sm md:text-lg'>{counts[id]?.useful || 0}</p>
        <button onClick={() => handleReaction(id, "useful")}>
          <motion.div
            animate={
              counts[id]?.useful === 1
                ? { scale: [1, 1.3, 1] }
                : {} 
            }
            transition={{ duration: 0.3 }}
          >
            <AiOutlineLike className='md:text-lg text-sm' />
          </motion.div>
        </button>
      </div>

      <div className="flex items-center space-x-1 dark:text-gray-200">
        <p className='md:text-lg text-sm'>{counts[id]?.not_useful || 0}</p>
        <button onClick={() => handleReaction(id, "not_useful")}>
          <motion.div
            animate={
              counts[id]?.not_useful === 1 
                ? { scale: [1, 1.3, 1] } 
                : {}//اذا ما تفاعل
            }
            transition={{ duration: 0.3 }} 
          >
            <AiOutlineDislike  className='text-sm md:text-lg'/>
          </motion.div>
        </button>
      </div>
    </div>
  );
}

export default ReactionPanel;