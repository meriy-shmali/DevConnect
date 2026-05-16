
import React from 'react'
import { useState,useRef,useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import {motion, AnimatePresence } from 'framer-motion';
const Choiches = ({ setCategory }) => {
  const {t} =useTranslation();
const [activeTab, setActiveTab] = useState("all"); // حالة لمعرفة القسم المختار
  // مصفوفة الخيارات لتسهيل التحكم بالكود
  const tabs = [
     { id: 'all', label: t('all'), color: 'text-gray-500' },
    { id: 'question', label: t('questions'), color: 'text-hover-question' },
    { id: 'article', label: t('article'), color: 'text-hover-articles' },
    { id: 'project', label: t('projects'), color: 'text-hover-project' },
    { id: 'information', label: t('information'), color: 'text-hover-information' },
   
  ];

  const handleCategoryChange = (id) => {
    setActiveTab(id);
    setCategory(id);
  };
  
  return (
    <div className=' '>
      <div className='flex flex-row  justify-start items-center space-x-4 md:space-x-20 mt-8 ml-4 md:mt-12 md:ml-5'>
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => handleCategoryChange(tab.id)}
              className={`
                relative transition-all duration-300 pb-2
                text-[15px] md:text-[28px] font-semibold title-font
                ${tab.color} 
                
              `}
            >
              {tab.label}

              {/* هذا هو الخط السفلي الذي "يسافر" بين الكلمات */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-current rounded-full"
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30 
                  }}
                />
              )}

              {/* خط شفاف جداً يظهر عند الـ hover للأزرار غير المختارة (اختياري) */}
              {activeTab !== tab.id && (
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-current opacity-20 rounded-full transition-all duration-300 group-hover:w-full" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Choiches