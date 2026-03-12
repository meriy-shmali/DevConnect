import CreatepostLogic from '@/hook/CreatepostLogic';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Buttons from '../ui/ButtonGroup';
import { BsStars } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import AIAssistant from "./AIAssistant";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";

const CreatepostMobile = () => {
    const post=CreatepostLogic();
    const {t}=useTranslation();
  return (
    <div className='flex-col mt-14  space-y-16'>
    <div> <p className='text-5xl flex justify-center items-center font-semibold'>{t('create')}</p></div>
    <div className='flex justify-center'>
     <Textarea
     placeholder={t('share')}
     value={post.text}
     onChange={(e) => post.setText(e.target.value)}
     className='w-[500px] h-[100px] text-xl'/>
     </div>
     
      {/* PREVIEW AREA */}
              
{post.previewUrl.length > 0 && (
  <div className="flex items-center gap-4 p-3 rounded-lg  justify-center ">
    {post.previewUrl.map((src, index) => (
      <div key={index}>
        <img
          src={src}
          className="w-20 h-20 object-cover rounded"
        />
        <button onClick={() => post.removeImage(index)}>
          <FaRegTrashAlt className="text-red-500 hover:text-red-700 text-[25px] mt-2 text-center" />
        </button>
      </div>
    ))}
  </div>
)}
                <input
            type="file"
            ref={post.uploadRef}
            className="hidden"
            onChange={post.handleImageUpload}
            accept="image/*"
          />
     <div className="flex justify-center gap-x-6 mt-4">
  <Button onClick={() => post.uploadRef.current.click()}>
    <RiImageAddFill className="text-gray-600 size-[40px]" />
  </Button>
  <Buttons type='post' onClick={post.handlePost}/>
  <Buttons type='cancel' onClick={() => {
    post.setText("");
    post.removeImage();
  }}/>
</div>

     
     <div className='flex justify-center items-center'>
      <div className=' flex-col space-y-9'>
     <div className='text-xl'>{t('help')} </div>
     <div className='flex justify-center items-center'> <Button className="text-[22px] border-2 rounded-[50px]  pt-1 pb-1 text-black border-black  " onClick={()=>post.setshow(!post.show)}>{t('ai')}<BsStars className='size-[22px] text-amber-300'/></Button></div>
      <AnimatePresence>
            {
           post. show&&(
             <motion.div    initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.2 }}
                           >
            <AIAssistant improve={post.aiaction.improve} generate={post.aiaction.generate}
              summarize={post.aiaction.summarize} addtags={()=>post.aiaction.addTags(post.text)} category={()=>post.aiaction.categorize(post.text)}/>
              </motion.div>
            )
            }</AnimatePresence>
    </div>
     </div>
    </div>
  )
}

export default CreatepostMobile