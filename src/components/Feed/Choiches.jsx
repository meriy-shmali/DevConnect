
import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import {motion, AnimatePresence } from 'framer-motion';
const Choiches = ({ setCategory }) => {
  const {t} =useTranslation();
  const[show ,setshow]=useState(false);
  return ( <div className=' mt-8 ml-4  md:mt-8 md:ml-5'>
    <div className=' flex  items-start space-x-3'> 
      <div className='pt-2.5'>
      <button onClick={()=>setshow(!show)}>
        <TbAdjustmentsHorizontal className='text-4xl md:text-5xl' />
      </button></div>  <AnimatePresence>

        {show && (

        <motion.div
initial={{ opacity:0, scale:0.3 }}
animate={{ opacity:1, scale:1 }}
exit={{ opacity:0, scale:0.3 }}

transition={{ duration:0.25 }}

        className= 'origin-left bg-white shadow-lg text-lg p-3 w-fit flex space-x-5 md:p-4 rounded-2xl md:text-xl  '
        >

        <button className='hover:text-gray-400 duration-200'onClick={()=>{ setCategory("question")
         setshow(false)
}}>
          {t('questions')}
        </button>

        <button  className='hover:text-gray-400 duration-200' onClick={()=>{setCategory("articls")
          setshow(false)
        }}>
          {t('articls')}
        </button>

        <button  className='hover:text-gray-400 duration-200' onClick={()=>{setCategory("projects")
          setshow(false)
        }}>
          {t('projects')}
        </button>

        <button  className='hover:text-gray-400 duration-200' onClick={()=>{setCategory("problems")
          setshow(false)
        }}>
          {t('problems')}
        </button>

        <button  className='hover:text-gray-400 duration-200' onClick={()=>{setCategory("information")
          setshow(false)
        }}>
          {t('information')}
        </button>

        <button  className='hover:text-gray-400 duration-200'onClick={()=>{setCategory("all")
          setshow(false)
        }
      }>
          {t('all')}
        </button>

        </motion.div>

        )}

        </AnimatePresence>

    </div>
    </div>
  )
}

export default Choiches