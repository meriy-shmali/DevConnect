import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react';
import Buttons from '../ui/ButtonGroup'

const AiModal = ({ isOpen, result, onuse, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        /* 1. قمنا بإضافة حدث onClick={onClose} هنا على الخلفية الداكنة لتقوم بالإغلاق */
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            /* 2. قمنا بإضافة e.stopPropagation() لمنع إغلاق الكارد عند الضغط بداخل المودال نفسه */
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-[500px] max-w-[90%] rounded-xl md:p-6 p-8 shadow-xl dark:bg-dark-post-background cursor-default"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-5 end-4 p-2 z-10 hover:bg-gray-50 dark:hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500 text-xl font-light hover:text-red-700 dark:text-red-700" />
            </button>
            
            <div className="whitespace-pre-wrap text-gray-700 max-h-[500px] md:text-xl text-lg overflow-y-auto dark:text-gray-50 mt-2">
              {result}
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <Buttons type="ok" onClick={onuse}/>
              <Buttons type="cancel" onClick={onClose}/>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AiModal;