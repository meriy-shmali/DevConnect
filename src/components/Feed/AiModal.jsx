import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { IoClose } from "react-icons/io5"
import { LucideRefreshCw } from 'lucide-react';
import Buttons from '../ui/ButtonGroup'
const AiModal = ({open,result,onuse,onclose,onRegenerate,isPending}) => {
  return (
    <AnimatePresence>
        {
        open&&(
        <div className="fixed inset-0 flex items-center justify-center z-50 h-full bg-black/50 backdrop-blur-sm">
            <motion.div
            className="relative bg-white w-[600px] max-w-[90%] rounded-xl p-8 shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onclose}
              className="absolute top-3 right-3"
            >
              <IoClose className='text-[24px] text-red-600'/>
            </button>
            <div className="whitespace-pre-wrap text-gray-700 max-h-[500px] overflow-y-auto text-[22px] text-right p-4"
             style={{direction: 'rtl',unicodeBidi: 'plaintext',textAlign: 'start' }}>
              {result}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              {/* زر إعادة المحاولة الجديد */}
              <button 
                onClick={onRegenerate}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50 f"
              >
                <LucideRefreshCw className={isPending ? "animate-spin " : ""} 
                />
              </button>

              <Buttons type="use" onClick={onuse} />
            </div>
          </motion.div>
        </div>
        )
        }
    </AnimatePresence>
  )
}

export default AiModal