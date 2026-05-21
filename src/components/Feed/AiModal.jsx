import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoClose } from "react-icons/io5"
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
                <IoClose className='text-[24px] text-red-600' />
              </button>
              
              {/* 🌟 تعديل العرض النظيف ليدعم المارك داون من غير تكرار حاويات العرض */}
              <div className="whitespace-pre-wrap overflow-auto  modal-scroll text-gray-700 max-h-[500px] overflow-y-auto text-[18px] text-right p-4 markdown-content"
                style={{ direction: 'rtl', unicodeBidi: 'plaintext', textAlign: 'start' }}>
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              <div className='flex align-middle justify-between items-center mt-4'>
                <div className='flex'>
                  {showTranslate && (
                    <button
                      onClick={onTranslate}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg disabled:opacity-50 transition-colors"
                      title="Translate description"
                    >
                      <Languages className={`size-6 text-blue-800 transition-colors ${isPending ? "animate-pulse" : ""}`} />
                    </button>
                  )}
                </div> 

                {!hideActionButtons && (
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={onRegenerate}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
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