import React from 'react'
import Buttons from './ui/ButtonGroup'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function Welcomepage() {
  const navigate = useNavigate(); 
  const { t } = useTranslation();
  
  return (
    <>
      <div className='bg-gradient-background w-full min-h-screen p-5 flex flex-col justify-between'>
        
        {/* زر الترجمة */}
        <div className='w-fit ms-4 pt-4'>
          <Buttons type='translate' />
        </div>
        
        {/* الحاوية الرئيسية للعناصر */}
        <div className='flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 flex-grow px-4 md:px-10 max-w-7xl mx-auto w-full'>

          {/* قسم الصورة */}
          <div className='w-full max-w-[320px] md:max-w-[450px] lg:max-w-[500px] flex justify-center'>
            <img 
              src='/src/images/welcome.png' 
              alt="Welcome" 
              className='w-full h-auto object-contain' 
            />
          </div>

          
          <div className='text-white flex flex-col space-y-6 md:space-y-8 max-w-xl text-center md:text-start items-center md:items-start w-full'>
            
            <div className='font-bold w-full'>
              <p className='title-font text-[38px] md:text-5xl lg:text-6xl leading-tight'>{t("welcome")}</p>
              <span className='title-font text-[45px] md:text-6xl lg:text-7xl animate-reveal mt-1 inline-block tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>
                DevConnect
              </span>
            </div>

            {/* الوصف */}
            <p className='font-subtitle text-[16px] md:text-lg lg:text-xl font-light leading-relaxed text-gray-200'>
              {t('description')}
            </p>

            {/* 🛠️ التعديل هنا: زر البدء الآن بالمنتصف دائماً */}
            <div className='pt-4 w-full flex justify-center'>
              <Buttons type='start now' />
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Welcomepage