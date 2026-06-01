import React from 'react'
import RegisterForm from './RegisterForm'
import { useTranslation } from "react-i18next";
const Register = () => {
      const { t } = useTranslation();
  return (
   <div className='bg-main-background  relative z-50 md:pb-3.5 sm:pb-8  dark:text-dark-text  flex flex-col md:space-y-6  items-center md:flex-row md:justify-between overflow-hidden h-screen'>
      <div className=' mt-10 sm:mt-3 md:mt-12 md:px-12   flex flex-col   space-y-8 items-center md:items-start md:space-y-6 '>
        <div className='flex-col space-y-6  '><p className='title-font text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold md:mt-10  text-center md:text-left'>{t('create_account')}</p></div>
        <div className='  flex-col justify-start space-y-8 md:mt-3 mt-3  h-[450px] overflow-auto  ai-scroll '>
        <RegisterForm/>
        </div>
        
        </div>
        
      <div className='w-[290px]  md:w-[500px]  h-fit sticky top-0 flex-shrink-0  '><img src='src/images/login.png'/></div>
    </div>
  )
}

export default Register