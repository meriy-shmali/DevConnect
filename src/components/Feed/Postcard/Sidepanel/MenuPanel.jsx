import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
const MenuPanel = ({ id, menu, toggleMenu, onEdit, onDelete }) => {
    const {t}=useTranslation();
    const handleMenuClick = (e) => {
    e.stopPropagation(); // هذا السطر يمنع الانتقال لصفحة المنشور عند الضغط على القائمة
    toggleMenu(post.id);
};
  return (
    <div className="relative">
      <button onClick={(e) =>{ e.stopPropagation(); toggleMenu(id)}}>
        <BsThreeDotsVertical className='text-gray-600' />
      </button>

      {menu[id] && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg">
          
          <button  onClick={(e) => { e.stopPropagation(); onEdit(); }} className="px-3 py-1  flex items-center w-fit text-blue-500 hover:text-blue-400 ">
           <MdEdit className='mr-1 '/> {t('edit')} 
          </button>
        
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="px-3 py-1  flex items-center w-fit text-red-500 hover:text-red-400">
          <RiDeleteBin6Fill className='mr-1  '/> {t('delete')}
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPanel