import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { RiFlashlightFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
const PostAi = ({ id }) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const menuRef = useRef(null); // مرجع لتحديد عنصر القائمة

    // تابع فتح وإغلاق القائمة
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShow(!show);
    };

    // ميزة الإغلاق عند الضغط خارج الزر أو القائمة
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShow(false);
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);

    // تابع للتعامل مع ضغط الخيارات (مثال)
    const handleAction = (actionType) => {
        console.log(`Action: ${actionType}, Post ID: ${id}`);
        setShow(false); // إغلاق القائمة بعد اختيار الإجراء
    };

    return (
        <div className='relative' ref={menuRef}> 
            <motion.div
                className='flex items-center md:space-x-2 '
                // التعديل: يتوقف النبض (scale) تماماً عندما تكون القائمة مفتوحة (show = true)
                animate={!show ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ 
                    repeat: !show ? Infinity : 0, 
                    duration: 2, 
                    ease: "easeInOut" 
                }}
            >
                <button 
                    onClick={toggleMenu}
                    // أزلت pointer-events-none ليعمل الضغط
                    className='text-xs md:text-lg text-gradient font-semibold cursor-pointer flex flex-row justify-center items-center space-x-1 outline-none'
                >
                    <div>{t('askai')} </div> 
                    <div><BsStars md:size={18} size={14} className='text-yellow-400'/></div>
                </button>
            </motion.div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 10 }} // ظهور انسيابي للأسفل
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="absolute -top-28 md:end-24 end-10 bg-white dark:bg-navbar border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 flex flex-col justify-center z-[100] md:w-[200px] w-[180px] text-lg "
                        onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                     <button onClick={() => handleAction('best_answer')}
                            className="px-4 py-2 flex items-center justify-center w-full hover:font-semibold  dark:hover:text-gray-700 transition-colors" >
                           <div className='flex flex-row justify-center  items-strat space-x-6'>
                            <div> <FaCheck className='text-yellow-400'/> </div>
                           <div><p className='text-sm md:text-base ' >{t('bestanswer')}</p></div> 
                           
                            </div> 
                        </button></div>
                       <div>
                        <button 
                            onClick={() => handleAction('summarize_code')}
                            className="px-4 py-2 flex items-center justify-center dark:hover:text-gray-700 hover:font-semibold  w-full transition-colors"
                        >
                            <div className='flex flex-row justify-center items-center space-x-2'>
                                  <div> <RiFlashlightFill className='text-yellow-400 size-5'/></div>
                           <div><p className='text-sm md:text-base'>{t('summary')}</p></div> 
                         
                            </div>
                            
                        </button></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PostAi;
