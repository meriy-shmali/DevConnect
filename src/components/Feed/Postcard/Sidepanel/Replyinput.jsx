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
        className="border p-1 rounded w-full"
        placeholder= {t('write')}      />
      <button onClick={onSend}>< IoSend className='text-[25px] text-blue-700 '/></button>
    </div>
  );
}

export default Replyinput