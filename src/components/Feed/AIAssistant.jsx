import React from 'react'
import { BsFillFilePostFill } from "react-icons/bs";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
const AIAssistant = ({improve,generate,summarize,addtags,category}) => {
    const{t}=useTranslation();
  return (
    <div>
        <div className='w-[270px] h-auto rounded-[25px] border-white border-2 text-white mt-5 ml-16 shadow-xl/30'>
            <div className='text-center text-[32px] p-2'>Ai Assistant</div>
            <div className='flex-col  space-y-2 text-[24px] p-3 '>
              <button onClick={generate}><Button variant='ai'><BsFillFilePostFill className='size-[22px] text-yellow-300' /> {t('rephrase')}</Button></button> 
              <button onClick={improve}><Button variant='ai'><BsStars className='size-[22px] text-yellow-300'/>{t('improve')}</Button></button> 
              <button onClick={summarize}><Button variant='ai'><FaCode className='size-[22px] text-yellow-300' />{t('summarize')}</Button></button> 
              <button onClick={addtags}><Button variant='ai'><IoMdPricetags className='size-[22px] text-yellow-300' />{t('tags')}</Button></button> 
              <button onClick={category}> <Button variant='ai'><TbCategoryFilled className='size-[22px] text-yellow-300' />{t('categorize')}</Button></button>
            </div>

        </div>
    </div>
  )
}

export default AIAssistant