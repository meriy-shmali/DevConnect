import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
const MenuPanel = ({ id, menu, toggleMenu, onEdit, onDelete }) => {
    const {t}=useTranslation()
  return (
    <div className="relative">
      <button onClick={() => toggleMenu(id)}>
        <BsThreeDotsVertical className='text-gray-600' />
      </button>

      {menu[id] && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow py-2 flex flex-col z-50 w-[100px] text-lg">
          
          <button onClick={onEdit} className="px-3 py-1 hover:text-blue-500 flex items-center w-fit  ">
           <MdEdit className='mr-1'/> {t('edit')} 
          </button>
        
          <button onClick={onDelete} className="px-3 py-1 hover:text-red-500 flex items-center w-fit">
          <RiDeleteBin6Fill className='mr-1 '/> {t('delete')}
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPanel