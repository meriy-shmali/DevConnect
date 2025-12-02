import React from 'react'
import RegisterForm from './RegisterForm'
import { useTranslation } from "react-i18next";
const Register = () => {
      const { t } = useTranslation();
  return (
    <div className='bg-main-background min-h-screen flex flex-col items-center md:flex-row md:justify-between'>
      <div className='mt-8 md:ml-10 md:mt-3 flex flex-col items-center md:items-start'>
        <div><p className='text-[48px] md:text-[96px] font-semibold text-center md:text-left'>{t('register')}</p></div>
        <div className=' mt-10 flex-col justify-start space-y-8 '>
        <RegisterForm />
        </div>
        </div>
        
      <div className='self-start ml-40 mt-0  w-[400px] h-[700px] md:w-[759px] md:h-[814px] '><img src='src/images/login.png'/></div>
    </div>
  )
}

export default Register