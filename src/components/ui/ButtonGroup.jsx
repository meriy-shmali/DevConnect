import React from 'react'
import { Button } from './button'
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineGTranslate } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
const Buttons = ({ type ,onClick,...props }) => {
  const navigate=useNavigate();
  const { i18n,t } = useTranslation();
  if (type === "start now") {
    
    return (
      <Button {...props}
        className='bg-blue-button text-text-button md:text-lg text-sm hover:bg-hover-blue md:p-2 md:h-10 md:px-4 p-2 '
        variant='secondary'
        onClick={()=>navigate('/login') }
        /*size='lg'*/
      >
        {t('start')}<FaArrowRightLong className='text-text-button' />
      </Button>
    );
  }

  if (type === "translate") {
    const isArabic = i18n.language === "ar";
    return (
      <Button
        variant='link'
        className='text-text-button md:text-xl text-lg '
        onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
        
      >
        <MdOutlineGTranslate className='text-text-button  md:size-8 size-6' />
       {isArabic ? "English" : "Arabic"}
      </Button>
    );
  }
  if(type=='follow'){
    return(
      <Button variant='secondary'
      className='bg-follow-button text-text-button text-[22px] md:text-[24px] hover:bg-hover-purple'
      size='sm'>{t("follow")}</Button>
    )
  }
   if(type=='edit'){
    return(
      <Button variant='secondary'
      className='bg-follow-button text-text-button text-[24px] hover:bg-hover-purple'
      size='sm'>{t('edit')}<MdEdit className='size-[22px]' /></Button>
    )
  }
  if(type=='onClick={onClick}'){
    return(
      <Button variant='default'
      className='bg-cancel-button text-text-button text-[24px]'
      size='default'
       onClick={onClick}>
{t('cancel')}
      </Button>
    )
  }
  if(type=='logout'){
    return(
      <Button className='bg-cancel-button text-text-button text-[24px]' size='lg'>{t('logout')} <FiLogOut className='size-[22px]' /></Button>
    )
  }
  if(type=='login'){
    return(
  <Button type='submit' className='bg-gradient-background text-text-button text-sm md:text-md lg:text-lg ' variant='default' md:size='lg' >
    {t('login')}
  </Button>)}
  if(type=='register'){
    return(
  <Button type='submit' className=' bg-gradient-background text-text-button text-sm md:text-md lg:text-lg  ' variant='default' md:size='lg' >
    {t('register')}
  </Button>)}
  if(type=='send'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[20px] p-4 rounded-md'>{t('send')}</Button>
    )
  }
 if(type=='post'){
    return(
      <Button className='bg-blue-button text-text-button text-[20px] md:text-[25px]' variant='default' onClick={onClick}>{t('post')} </Button>
    )
  }
   if(type=='use'){
    return(
      <Button className='bg-blue-button text-text-button md:text-[25px]' variant='default' onClick={onClick}>{t('use')}</Button>
    )
  }
   if(type=='save'){
    return(
      <Button className='bg-blue-button text-text-button md:text-md' variant='default' size='default'>{t('save')}</Button>
    )
  }
  if(type=='ai'){
    return(
      <Button className='border-ai-assistant text-ai-assistant bg-white text-[22px]' variant='outline'><FaRobot className='text-ai-assistant size-[28px]' size='lg'/>{t('ai')}</Button>
    )
  }

  return null;
}

export default Buttons;