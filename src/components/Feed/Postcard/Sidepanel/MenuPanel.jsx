import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MenuPanel = ({ id, menu, toggleMenu, onEdit, onDelete, size = 17 }) => {
  const { t } = useTranslation();
  const menuRef = useRef(null);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menu[id] && menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(id);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menu[id]]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => toggleMenu(id)} className="p-1">
        <BsThreeDotsVertical className='text-gray-600 dark:text-gray-300' size={size} />
      </button>

      {menu[id] && (
        <motion.div
          initial={{ y: 0, x: 0 }}
          animate={{ y: 2, x: isRTL ? 2 : -2 }}
          exit={{ y: 2 }}
          transition={{ type: "tween", duration: 0.1 }}
          /* 🌟 قمنا بزيادة عرض القائمة قليلاً إلى w-[120px] لترتاح الكلمات بداخلها */
          className="absolute end-4 top-5 bg-white dark:bg-dark-post-background border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl py-1.5 flex flex-col z-[9999] w-[120px] text-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🌟 تعديل الأزرار لتصبح بعرض كامل w-full ومع ميزة منع انكسار السطور whitespace-nowrap */}
          <button 
            onClick={onEdit} 
            className="px-3 py-1 text-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center w-full justify-start text-sm md:text-base whitespace-nowrap"
          >
            <MdEdit className='me-2 flex-shrink-0'/> {t('edit')} 
          </button>
        
          <button 
            onClick={onDelete} 
            className="px-3 py-1 text-red-500 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center w-full justify-start text-sm md:text-base whitespace-nowrap"
          >
            <RiDeleteBin6Fill className='me-2 flex-shrink-0'/> {t('delete')}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default MenuPanel;