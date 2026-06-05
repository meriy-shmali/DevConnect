import React from 'react'
import RegisterForm from './RegisterForm'
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  
  return (
    // 1. h-screen تثبت الصفحة على قد الشاشة تماماً
    // 2. overflow-hidden تلغي سكرول المتصفح الخارجي نهائياً
    <div className='bg-main-background h-screen relative z-50 overflow-hidden dark:text-dark-text flex flex-col md:flex-row items-center justify-center lg:justify-between px-6 md:px-12 lg:px-24 gap-6 max-w-7xl mx-auto w-full py-4md:py-8'>
      
      {/* قسم الفورم والعنوان */}
      {/* h-full يجعل القسم يستغل كامل الارتفاع المتاح ليتحكم بالسكرول داخله */}
      <div className='flex flex-col w-full max-w-[450px] lg:max-w-[500px] h-full  xl:max-w-[600px] xl:h-[900px] justify-center py-12'>
        
        {/* عنوان الصفحة - ثابت لا يتحرك */}
        <div className='w-full md:mb-10 flex-shrink-0'>
          <p className='title-font text-3xl lg:text-4xl xl:5xl font-bold text-center md:text-start leading-tight'>
            {t('create_account')}
          </p>
        </div>
        
        {/* 🛠️ صندوق الفورم: flex-grow يخليه يأخذ كل المساحة المتاحة عمودياً، و overflow-y-auto يحصر السكرول هنا فقط */}
        <div className='w-full flex-grow overflow-y-auto pr-2 ai-scroll pb-6'>
          <RegisterForm />
        </div>
        
      </div>
        
      {/* قسم الصورة الجانبية - ثابتة ولا تتحرك مع السكرول */}
     <div className='w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] flex-shrink-0 flex justify-center'>
        <img 
          src='src/images/login.png' 
          alt="Login illustration" 
          className='w-full h-auto object-contain'
        />
      </div>

    </div>
  )
}

export default Register;