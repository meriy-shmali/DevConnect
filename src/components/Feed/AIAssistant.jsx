import React from 'react'
import { BsFillFilePostFill } from "react-icons/bs";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
const AIAssistant = ({ improve,generate,summarize,addtags,category, improveM, addM,generateM,summarizeM,categoryM,type='', onClose}) => {
    const{t}=useTranslation();
    if(type=='mobile'){
  return (
    <div >
        <div className=' relative bg-gradient-background w-[250px] h-auto rounded-[25px]   text-white  ml-[110px] shadow-xl/30'>
            <div className='text-center text-[25px] p-2'>Ai Assistant</div>
            <div className='flex-col  space-y-1 text-[24px] p-3 '> 
              {/* منمنع ارسال اكتر من طلب واحد للباك */}
              <button onClick={generate} disabled={generateM.isPending} ><Button variant='ai'><BsFillFilePostFill className='size-[22px] text-yellow-300' /> {t('rephrase')}</Button></button> 
              <button onClick={improve} disabled={improveM.isPending}><Button variant='ai'><BsStars className='size-[22px] text-yellow-300'/>{t('improve')}</Button></button> 
              <button onClick={summarize}disabled={summarizeM.isPending}><Button variant='ai'><FaCode className='size-[22px] text-yellow-300' />{t('summarize')}</Button></button> 
              <button onClick={addtags} disabled={addM.isPending}><Button variant='ai'><IoMdPricetags className='size-[22px] text-yellow-300' />{t('tags')}</Button></button> 
              <button onClick={category} disabled={categoryM.isPending}> <Button variant='ai'><TbCategoryFilled className='size-[22px] text-yellow-300' />{t('categorize')}</Button></button>
            </div>

        </div>
    </div>
  )}
 if(type=='sidepanel'){
   return (
    <div >
        <div className=' text-white flex-col'>
            <div className=' flex justify-center items-center space-x-2 text-center text-[40px] p-2'><p>Ai Assistant</p> <BsStars className="size-[30px] text-amber-300" /> </div>
            <div className='flex flex-col items-start mt-10  w-full space-y-8  '> 
              {/* منمنع ارسال اكتر من طلب واحد للباك */}
              <button   onClick={() => {
    generate();
    onClose();
  }}
  disabled={generateM.isPending} ><Button variant='ai_sidepanel'><BsFillFilePostFill className='size-[25px] text-yellow-300' /> {t('rephrase')}</Button></button> 
              <button onClick={() => {
    improve();
    onClose();
  }}
  disabled={improveM.isPending}><Button variant='ai_sidepanel'><BsStars className='size-[25px] text-yellow-300'/>{t('improve')}</Button></button> 
              <button onClick={() => {
    summarize();
    onClose();
  }}
  disabled={summarizeM.isPending}><Button variant='ai_sidepanel'><FaCode className='size-[25px] text-yellow-300' />{t('summarize')}</Button></button> 
              <button onClick={() => {
    addtags();
    onClose();
  }}
  disabled={addM.isPending}><Button variant='ai_sidepanel'><IoMdPricetags className='size-[25px] text-yellow-300' />{t('tags')}</Button></button> 
              <button  onClick={() => {
    category();
    onClose();
  }}
  disabled={categoryM.isPending}> <Button variant='ai_sidepanel'><TbCategoryFilled className='size-[25px] text-yellow-300' />{t('categorize')}</Button></button>
            </div>

        </div>
    </div>
  )
 }
}

export default AIAssistant