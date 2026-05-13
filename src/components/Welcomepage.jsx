import React from 'react'
import Buttons from './ui/ButtonGroup'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
function Welcomepage() {
  const { currentUser } = useAuth();
 const Navigte=useNavigate();
   const { t } = useTranslation();
    if (currentUser) {
    return <Navigte to="/feed" />;
  }
  return (

    <>
      <div className='bg-gradient-background w-screen h-screen p-5 '>
        <div className='w-fit ms-4 pt-4'>
          <Buttons type='translate' />
        </div>
        <div className='flex flex-col-reverse md:flex-row md:space-x-1 space-y-10 md:space-y-0 justify-center  '>

          <div className='mt-10 md:mt-40 w-[430px] ms-36 md:w-[800px] px-5 md:ms-16  '>
            <img 
              src='/src/images/welcome.png' 
            />
          </div>

          <div className='text-white flex flex-col mt-10 space-y-10  md:space-y-6  items-center  '>
            <div className='font-bold  text-center md:text-start'>
              <p className=' title-font text-[50px] md:text-[80px]  '>{t("welcome")}</p>
              <span className=' title-font text-[60px] md:text-[100px] animate-reveal inline-block tracking-tighter'>DevConnect</span>
            </div>

            <div className=' font-subtitle text-[20px] md:text-[30px] font-light md:w-[700px]  text-center md:text-center px-5 md:px-0 '>
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
