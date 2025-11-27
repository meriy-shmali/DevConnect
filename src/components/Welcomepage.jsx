import React from 'react'
import Buttons from './ui/ButtonGroup'
import { useTranslation } from "react-i18next";
function Welcomepage() {
   const { t } = useTranslation();
  return (

    <>
      <div className='bg-gradient-background w-screen h-screen p-5'>
        <div className='w-fit ml-4 pt-4'>
          <Buttons type='translate' />
        </div>
        <div className='flex flex-col-reverse md:flex-row md:space-x-20 space-y-10 md:space-y-0'>

          <div className='mt-4 md:mt-40 w-[450px] ml-36 md:w-[800px] px-5 md:ml-16'>
            <img 
              src='/src/images/welcome.png' 
            />
          </div>

          <div className='text-white flex flex-col mt-10  space-y-10'>
            <div className='font-bold leading-28 text-center md:text-left'>
              <p className='text-6xl md:text-[96px] mb-4'>{t("welcome")}</p>
              <span className='text-7xl md:text-[128px]'>DevConnect</span>
            </div>

            <div className='text-lg md:text-[28px] md:w-[700px] font-extralight text-center md:text-center px-5 md:px-0'>
             {t('description')}
            </div>

            <div className='flex justify-center md:justify-center'>
              <Buttons type='ai' />
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Welcomepage
