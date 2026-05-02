import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import { useEffect,useRef } from 'react';
import { motion } from 'framer-motion';
const MenuPanel = ({ id, menu, toggleMenu, onEdit, onDelete,size=20 }) => {
    const {t}=useTranslation()
    const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menu[id]&& menuRef.current && !menuRef.current.contains(event.target)) {
       !toggleMenu(id);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menu[id]]);
  return (
    
    <div className="relative" ref={menuRef}>
      <button onClick={() => toggleMenu(id)}>
        <BsThreeDotsVertical className='text-gray-600 dark:text-gray-400' size={size} />
      </button>

      {menu[id] && (
         <motion.div
           initial={{ y: 0,x:0 }}
        animate={{ y: 2 ,x:-2 }}
        exit={{ y: 2 }}
        transition={{ type:"tween" ,duration: 0.1 }}
        className="absolute right-4 top-5  bg-white dark:bg-dark-main-background border-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg"
            onClick={(e) => e.stopPropagation()}
          >
       
          
          <button onClick={onEdit} className="px-3 py-1 text-blue-500 hover:text-blue-400 flex items-center w-fit   ">
           <MdEdit className='mr-1'/> {t('edit')} 
          </button>
        
          <button onClick={onDelete} className="px-3 py-1 text-red-500 hover:text-red-400 flex items-center w-fit  ">
          <RiDeleteBin6Fill className='mr-1 '/> {t('delete')}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default MenuPanel