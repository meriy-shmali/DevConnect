import React from 'react'
import ChangeForm from './ChangeForm'
import Header from './Header'
import { useTranslation } from "react-i18next";
const ChangePassword = () => {
      const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-main-background dark:bg-dark-background  transition-colors duration-300">
      <Header />
      <main className="  mx-auto py-4 ml-4 mr-8 md:ml-20  mb-8 flex flex-col items-start ">
        
          <h1 className="text-[32px] md:text-[48px] font-bold self-start mt-8 mb-10">
          {t('change_password')}
          </h1>
          
          <ChangeForm />
           
      </main>
    </div>
  )
}

export default ChangePassword