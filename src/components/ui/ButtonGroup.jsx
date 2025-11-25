import React from 'react'
import { Button } from './button'
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineGTranslate } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
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
  if(type=='follow'){
    return(
      <Button variant='secondary'
      className='bg-follow-button text-text-button text-[24px] hover:bg-hover-purple'
      size='sm'>Follow</Button>
    )
  }
   if(type=='edit'){
    return(
      <Button variant='secondary'
      className='bg-follow-button text-text-button text-[24px] hover:bg-hover-purple'
      size='sm'>Edit<MdEdit className='size-[22px]' /></Button>
    )
  }
  if(type=='cancel'){
    return(
      <Button variant='default'
      className='bg-cancel-button text-text-button text-[24px]'
      size='default'>
Cancel
      </Button>
    )
  }
  if(type=='logout'){
    return(
      <Button className='bg-cancel-button text-text-button text-[24px]' size='lg'>Logout <FiLogOut className='size-[22px]' /></Button>
    )
  }
  if(type=='login'){
    return(
  <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default' size='lg'>
    Login
  </Button>)}
  if(type=='send'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default'>Send</Button>
    )
  }
 if(type=='post'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default'>Post</Button>
    )
  }
   if(type=='use'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default'>Use</Button>
    )
  }
   if(type=='save'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default'>Save</Button>
    )
  }
  if(type=='ai'){
    return(
      <Button className='border-ai-assistant text-ai-assistant bg-white text-[22px]' variant='outline'><FaRobot className='text-ai-assistant size-[28px]' size='lg'/>AI Assistant </Button>
    )
  }

  return null;
}

export default Buttons;