import React from 'react'
import { IoSend } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
const Replyinput = ({ value, onChange, onSend }) => {
  const {t}=useTranslation()
   return (
    <div className="flex mt-2 space-x-2">
      <input
        value={value}
        onChange={onChange}
              onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enter بدون Shift
      e.preventDefault(); // يمنع السطر الجديد
      onSend();
    }
  }}
        className="border p-1 rounded w-full dark:bg-gray-100"
        placeholder= {t('write')}      />
   
      <button onClick={onSend}>< IoSend className='text-[25px] text-blue-700 '/></button>
    </div>
  );
}

export default Replyinput