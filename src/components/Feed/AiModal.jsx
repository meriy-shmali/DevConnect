import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react';
import { LucideRefreshCw } from 'lucide-react';
import { Languages } from 'lucide-react';
import Buttons from '../ui/ButtonGroup'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'

const AiModal = ({ open, result, onuse, onclose, onRegenerate, isPending, onTranslate, showTranslate, hideActionButtons }) => {
  return createPortal(
    <AnimatePresence>
      {
        open && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] h-full bg-black/50 ">
            <motion.div
              className="relative bg-white dark:bg-dark-post-background  w-[420px] max-w-[80%] rounded-xl p-6 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={onclose} className=" absolute top-5 end-4 p-1 z-10 hover:bg-gray-50 dark:hover:bg-black/20 rounded-full transition-colors">
                         <X className="w-5 h-5 text-red-500 text-xl font-light hover:text-red-700 dark:text-red-700 " />
                       </button>
              
              {/* 🌟 تعديل العرض النظيف ليدعم المارك داون من غير تكرار حاويات العرض */}
              <div className="whitespace-pre-wrap mt-3 overflow-auto  modal-scroll text-gray-700 dark:text-white max-h-[300px] overflow-y-auto text-[18px] md:text-[18px] text-right p-4 markdown-content"
                style={{ direction: 'rtl', unicodeBidi: 'plaintext', textAlign: 'start' }}>
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              <div className='flex align-middle justify-between items-center mt-4'>
                <div className='flex'>
                  {showTranslate && (
                    <button
                      onClick={onTranslate}
                      disabled={isPending}
                      className="flex items-center gap-2 md:px-4 md:py-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 md:rounded-lg rounded-md disabled:opacity-50 transition-colors"
                      title="Translate description"
                    >
                      <Languages className={`md:size-6 size-4 text-blue-800 transition-colors ${isPending ? "animate-pulse" : ""}`} />
                    </button>
                  )}
                </div> 

                {!hideActionButtons && (
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={onRegenerate}
                      disabled={isPending}
                      className="flex text-md items-center gap-2 px-4 py-1.5 bg-gray-200 dark:bg-gray-300 dark:hover:bg-gray-100 hover:bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
                    >
                      <LucideRefreshCw className={isPending ? "animate-spin" : ""} />
                    </button>
                    <Buttons type="use" onClick={onuse} />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )
      }
    </AnimatePresence>,
    document.body
  )
}

export default AiModal;