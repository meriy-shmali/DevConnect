import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
const MenuPanel = ({ id, menu, toggleMenu, onEdit, onDelete,size=20 }) => {
    const {t}=useTranslation()
  return (
    <div className="relative">
      <button onClick={() => toggleMenu(id)}>
        <BsThreeDotsVertical className='text-gray-600 dark:text-gray-400' size={size} />
      </button>

      {menu[id] && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-dark-main-background border-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg">
          
          <button onClick={onEdit} className="px-3 py-1 text-blue-500 hover:text-blue-400 flex items-center w-fit   ">
           <MdEdit className='mr-1'/> {t('edit')} 
          </button>
        
          <button onClick={onDelete} className="px-3 py-1 text-red-500 hover:text-red-400 flex items-center w-fit  ">
          <RiDeleteBin6Fill className='mr-1 '/> {t('delete')}
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPanel