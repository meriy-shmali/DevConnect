import React from 'react'
import LoginForm from './LoginForm'
import Buttons from '../ui/ButtonGroup'
import { Button } from '../ui/button'
import { useTranslation } from "react-i18next";
const Login = () => {
  const { t ,} = useTranslation();
  return (
    <div className='bg-main-background   relative z-50   dark:text-dark-text  flex flex-col items-center md:flex-row md:justify-between md:overflow-hidden md:h-screen'>
      <div className='mt-12 md:ms-40  flex flex-col md:space-y-3 items-center md:items-start '>
        <div className='flex-col md:space-y-6 space-y-3'><p className='title-font text-[48px] md:text-[70px] font-bold  text-center md:text-left'>{t('welcome_back')}</p></div>
        <div className=' mt-14 flex-col justify-start space-y-8 '>
        <LoginForm />
        </div>
        
        </div>
        
      <div className='w-[400px]  md:w-[700px] md:h-[800px] -mt-2 md:me-24 h-screen sticky top-0 flex-shrink-0  '><img src='src/images/login.png'/></div>
    </div>
  )
}

export default Login