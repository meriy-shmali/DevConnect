import React from 'react'
import { IoSend } from "react-icons/io5";
const Replyinput = ({ value, onChange, onSend }) => {
   return (
    <div className="flex mt-2 space-x-2">
      <input
        value={value}
        onChange={onChange}
        className="border p-1 rounded w-full"
        placeholder="اكتب رد..."
      />
      <button onClick={onSend}>< IoSend className='text-[25px] text-blue-700 '/></button>
    </div>
  );
}

export default Replyinput