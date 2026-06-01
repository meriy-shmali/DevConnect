import React from 'react'
import ChangeForm from './ChangeForm'
import { useTranslation } from "react-i18next";
const ChangePassword = () => {
      const { t } = useTranslation();
  return (
    <div className="w-full overflow-x-hidden mt-8 bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E]   transition-colors duration-300">
      
      <main className="  mx-auto py-4  px-4 lg:px-12 flex flex-col items-start ">
        
          <h1 className=" title-font text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold self-start mt-8  mb-10">
          {t('change_password')}
          </h1>
          
          <ChangeForm />
           
      </main>
    </div>
  )
}

export default ChangePassword