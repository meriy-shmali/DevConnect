import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { IoClose } from "react-icons/io5"
import Buttons from '../ui/ButtonGroup'
const AiModal = ({open,result,onuse,onclose}) => {
  return (
    <AnimatePresence>
        {
        open&&(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
            className="relative bg-white w-[500px] max-w-[90%] rounded-xl p-6 shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onclose}
              className="absolute top-3 right-3"
            >
              <IoClose className='text-[20px] text-red-600'/>
            </button>
            <div className="whitespace-pre-wrap text-gray-700 max-h-[300px] overflow-y-auto">
              {result}
            </div>
             <div className="flex justify-end gap-3 mt-6">
           <Buttons type="cancel" onClick={onclose}/>
           <Buttons type="use" onClick={onuse}/>
              
         </div>
          </motion.div>
        </div>
        )
        }
    </AnimatePresence>
  )
}

export default AiModal