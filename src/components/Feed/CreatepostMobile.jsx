import CreatepostLogic from '@/hook-temp/CreatepostLogic';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Buttons from '../ui/ButtonGroup';
import { BsStars } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import AIAssistant from "./AIAssistant";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import AiModal from '@/components/Feed/AiModal';
import { IoArrowBack } from "react-icons/io5";

const CreatepostMobile = () => {
    const post = CreatepostLogic();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // 🎯 تأمين استخراج النص الحالي سواء كان اسمه text أو content داخل الهوك
    const currentText = post.text !== undefined ? post.text : (post.content || "");
    const handleTextChange = (val) => {
        if (post.setText) post.setText(val);
        if (post.setContent) post.setContent(val);
    };

    return (
        <div className='bg-gradient-background min-h-screen'>
            <div className='relative top-15 right-1/3 me-12'>
                <button onClick={() => navigate('/feed')}>
                    <IoArrowBack className='text-gray-50 text-3xl' />
                </button>
            </div>
            
            <div className='flex-col mt-14 space-y-18 pb-36'>
                <div> 
                    <p className='text-4xl flex justify-center items-center font-semibold text-gray-50 title-font'>
                        {t('create')}
                    </p>
                </div>
                
                <div className='flex justify-center'>
                    <Textarea
                        placeholder={t('share')}
                        value={currentText}
                        onChange={(e) => handleTextChange(e.target.value)}
                        className='w-[350px] h-[100px] text-lg placeholder:text-gray-400 bg-gray-50 dark:bg-gray-50 '
                    />
                </div>
                
                {/* PREVIEW AREA */}
                {post.previewUrl && post.previewUrl.length > 0 && (
                    <div className="flex items-center gap-2 p-1 rounded-lg justify-center ">
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
                
                <div className="flex justify-center gap-x-3 mt-2">
                    <Button onClick={() => post.uploadRef.current.click()}>
                        <RiImageAddFill className="text-gray-200 dark:text-gray-200 size-[40px]" />
                    </Button>
                    <button onClick={() => post.handlePost({ redirectAfterPost: true })} className='bg-blue-button w-fit text-white text-2xl rounded-lg px-4 py-1.5'>{t('post')}</button> 
                   {post.text.trim() !== "" && (
                                 <Button
                                   className="text-white bg-cancel w-fit h-fit py-1.5 text-2xl"
                                   onClick={() => {
                                     post.resetForm();
                                   }}
                                 >
                                   {t("cancel")}
                                 </Button>
                               )}
                </div>

                <div className='flex justify-center  items-center'>
                    <div className='flex-col space-y-9'>
                        <div className='flex-row justify-center items-center text-2xl p-2 text-gray-200 text-center leading-12 '>
                            {t('help')}
                            <Button className="text-[22px] border-2 rounded-[50px] ms-3 pt-1 pb-1 border-white text-gray-200 " onClick={() => post.setshow(!post.show)}>
                                {t('ai')}<BsStars className='size-[22px] text-amber-300'/>
                            </Button>
                        </div>
                        
                        <AnimatePresence> 
                            {post.show && (
                                <motion.div    
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className='relative right-12'
                                >
                                    {/* ✨ إصلاح تمرير النص المباشر لدالات التوليد لمنع الـ failed */}
                                    <AIAssistant
                                        type='mobile' 
                                        improve={() => post.aiaction.improve(currentText)} 
                                        generate={() => post.aiaction.generate(currentText)}
                                        summarize={() => post.aiaction.summarize(currentText)} 
                                        addtags={() => post.aiaction.addTags(currentText)} 
                                        category={() => post.aiaction.categorize(currentText)}
                                        improveM={post.improveMutation} 
                                        generateM={post.generateMutation} 
                                        summarizeM={post.summarizeMutation}
                                        addM={post.addtagMutation} 
                                        categoryM={post.categoryMutation}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                <AiModal 
                    open={post.showModel}
                    result={post.aiResult}
                    onuse={post.handleUseAi}
                    showTranslate={post.aiType === "summarize"} 
                    hideActionButtons={false} 
                    onTranslate={post.aiaction?.toggleTranslation}
                    onclose={() => post.setshowModel(false)} 
                />
            </div>
        </div>
    )
}

export default CreatepostMobile;