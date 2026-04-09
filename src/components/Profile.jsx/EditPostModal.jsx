import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot } from 'lucide-react';
import AiDropdown from '../AiDropdown';
import { useTranslation } from 'react-i18next';

const EditPostModal = ({ isOpen, onClose, postData, onSave }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(postData?.content || '');
  const [showAiDropdown, setShowAiDropdown] = useState(false);
   // تعريف الأكشنز التي سيقوم بها الـ AI
  const aiActions = {
    generate: () => { console.log("Rephrasing..."); setShowAiDropdown(false); },
    improve: () => { console.log("Improving..."); setShowAiDropdown(false); },
    summarize: () => { console.log("Summarizing..."); setShowAiDropdown(false); },
    addTags: () => { console.log("Adding Tags..."); setShowAiDropdown(false); },
    categorize: () => { console.log("Categorizing..."); setShowAiDropdown(false); },
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all duration-300 cursor-pointer" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 cursor-default p-4" onClick={(e)=>e.stopPropagation()}>
          {/* Header */}
        <div className=" relative flex items-center shrink-0 p-4 ml-3">
            <h2 className="text-4xl font-medium text-gray-900  tracking-tight p-2">{t('edit_post')}</h2>
          <button onClick={onClose} className=" absolute top-5 right-5 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6  text-red-500 text-xl font-light hover:text-red-700 " />
          </button>
        </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className=" 
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide rounded-xl
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[150px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20" 
          />

          {/* Footer Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onSave(content)}
              className="rounded-md bg-blue-700 px-6 py-1.5 text-sm text-white hover:bg-blue-800"
            >
              {t('post')}
            </button>
            
            <button
              onClick={onClose}
              className="rounded-md bg-red-500 px-6 py-1.5 text-sm text-white hover:bg-red-600"
            >
              {t('cancel')}
            </button>

            {/* AI Assistant Button */}
            <div className="relative">
              <button
                onClick={() => setShowAiDropdown(!showAiDropdown)}
                className="flex items-center gap-2 rounded-md border border-purple-300 px-4 py-1.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <Bot size={16} className="text-purple-600" />
                Ai assistant
              </button>
              
             {showAiDropdown && (
        <div className="absolute bottom-full mb-2 right-0"> 
          <AiDropdown actions={aiActions} />
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default EditPostModal;