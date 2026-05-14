import React from 'react'
import RegisterForm from './RegisterForm'
import { useTranslation } from "react-i18next";
const Register = () => {
      const { t } = useTranslation();
  return (
   <div className='bg-main-background  relative z-50   dark:text-dark-text  flex flex-col md:space-y-10  items-center md:flex-row md:justify-between overflow-hidden h-screen'>
      <div className=' mt-10 md:-mt-2 md:ms-40   flex flex-col   space-y-8 items-center md:items-start md:space-y-6 '>
        <div className='flex-col space-y-6  '><p className='title-font text-[48px] md:text-[70px] font-bold  text-center md:text-left'>{t('create_account')}</p></div>
        <div className='  flex-col justify-start space-y-8 md:mt-6 mt-3  h-[450px] overflow-auto  ai-scroll '>
        <RegisterForm/>
        </div>
        
        </div>
        
      <div className='w-[400px]  md:w-[700px] md:h-[800px] -mt-2 md:me-24 h-screen sticky top-0 flex-shrink-0  '><img src='src/images/login.png'/></div>
    </div>
  )
}

export default Register