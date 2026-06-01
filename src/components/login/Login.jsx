import React from 'react'
import LoginForm from './LoginForm'
import Buttons from '../ui/ButtonGroup'
import { Button } from '../ui/button'
import { useTranslation } from "react-i18next";
const Login = () => {
  const { t ,} = useTranslation();
  return (
    <div className='bg-main-background h-full    relative z-50   dark:text-dark-text  flex flex-col items-center md:flex-row md:justify-between md:overflow-hidden '>
      <div className='md:mt-8 md:px-12 mt-12  flex flex-col md:space-y-3 items-center md:items-start '>
        <div className='flex-col md:space-y-6 space-y-1'><p className='title-font text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold  text-center md:text-left'>{t('welcome_back')}</p></div>
        <div className='  md:mt-6 mt-8 flex-col justify-start space-y-6 '>
        <LoginForm />
        </div>
        
        </div>
        
      <div className='w-[290px]  md:w-[500px]  h-fit sticky top-0 flex-shrink-0  '><img src='src/images/login.png'/></div>
    </div>
  )
}

export default Login