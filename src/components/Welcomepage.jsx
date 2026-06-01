import React from 'react'
import Buttons from './ui/ButtonGroup'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function Welcomepage() {

 const Navigte=useNavigate();
   const { t } = useTranslation();
  
  return (

    <>
      <div className='bg-gradient-background w-screen min-h-screen p-5 '>
        <div className='w-fit ms-4 pt-4'>
          <Buttons type='translate' />
        </div>
        <div className='flex flex-col-reverse md:flex-row md:space-x-1 space-y-10 md:space-y-0 justify-center  '>

          <div className='mt-12 md:mt-16   w-[360px]  md:w-fit rtl:md:w-fit rtl:me-16 px-5  lg:ms-16  '>
          <img src='/src/images/welcome.png' />
          </div>

          <div className='text-white flex flex-col mt-10 space-y-10  md:space-y-6  items-center  '>
            <div className='font-bold  text-center md:text-start'>
              <p className=' title-font text-[42px] md:text-6xl  '>{t("welcome")}</p>
              <span className=' title-font text-[49px] md:text-7xl animate-reveal md:mt-2 inline-block tracking-tighter'>DevConnect</span>
            </div>

            <div className=' font-subtitle text-[18px] md:text-xl font-light md:w-full  text-center md:text-center px-5 md:px-0 '>
             {t('description')}
            </div>

            <div className=' flex justify-center items-center md:justify-center mt-8 '>
              <Buttons type='start now' />
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Welcomepage
