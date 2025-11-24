import React from 'react'
import { Button } from './button'
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineGTranslate } from "react-icons/md";
const Buttons = ({ type }) => {
  if (type === "start now") {
    return (
      <Button
        className='bg-blue-button text-text-button md:text-[25px] hover:bg-hover-startnow md:p-6 md:h-10 md:px-6 '
        variant='secondary'
        /*size='lg'*/
      >
        start now <FaArrowRightLong className='text-text-button' />
      </Button>
    );
  }

  if (type === "translate") {
    return (
      <Button
        variant='link'
        className='text-text-button text-2xl'
        
      >
        <MdOutlineGTranslate className='text-text-button  size-8' />
        Translate
      </Button>
    );
  }

  return null;
}

export default Buttons;