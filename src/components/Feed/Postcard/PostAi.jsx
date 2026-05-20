import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { FaCode } from "react-icons/fa6";
import { RiFlashlightFill } from "react-icons/ri";
import { usesmartsummary } from '@/hook/UseMutationsmartsummary';
import { useTranslatepost } from '@/hook/UsemutationTranslatepost';
import { FaCheck } from "react-icons/fa";
import { useExplainecode } from '@/hook/UseMutaionexplainecode';
import AiModal from '../AiModal';
import toast from 'react-hot-toast';

const PostAi = ({ id, content, code, codeLanguage }) => {
    // 🌟 إصلاح: تفكيك i18n هنا لقراءة اللغة الحالية للموقع بدون أخطاء
    const { t, i18n } = useTranslation();
    const [show, setShow] = useState(false);
    const menuRef = useRef(null); 
    const [openModal, setOpenModal] = useState(false);
    const [modalResult, setModalResult] = useState("");
    const [activeAction, setActiveAction] = useState(null);
    const [codeLangState, setCodeLangState] = useState("");

    const summaryMutation = usesmartsummary();
    const translateMutation = useTranslatepost();
    const explainCodeMutation = useExplainecode();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShow(!show);
    };

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

    const handleSummarizePost = () => {
        if (!content) return;
        const toastId = toast.loading(t('summarize_loading') || "Summarizing...");
        
        // 🌟 إصلاح: تعيين نوع الأكشن الحالي ليعرفه مودال الترجمة لاحقاً
        setActiveAction('summary_content');
        
        summaryMutation.mutate({
            content: content 
        }, {
            onSuccess: (res) => {
                const summaryText = res.data.summary; 
                if (summaryText) {
                    toast.success(t('summarize_success') || "Done!", { id: toastId });
                    setModalResult(summaryText); 
                    setOpenModal(true); 
                }
            },
            onError: () => toast.error(t('summarize_error') || "Error occurred", { id: toastId })
        });
    };

    const handleExplainCode = (targetLang) => {
        if (!code) return;
        const toastId = toast.loading(t('explain_loading') || "Analyzing Code...");
        setActiveAction('explain_code');
        
        // 🌟 الآن i18n أصبحت معرفة وجاهزة للقراءة ديناميكياً
        const currentRequestedLang = targetLang || (i18n.language === 'ar' ? 'ar' : 'en');
        setCodeLangState(currentRequestedLang);

        explainCodeMutation.mutate({
            code_content: code,          
            language: currentRequestedLang 
        }, {
            onSuccess: (res) => {
                const explanationText = res.data.explanation; 
                if (explanationText) {
                    toast.success(t('explain_success') || "Code Analyzed!", { id: toastId });
                    setModalResult(explanationText);
                    setOpenModal(true);
                }
            },
            onError: () => toast.error(t('explain_error') || "Failed to explain code", { id: toastId })
        });
    };

    const handleToggleTranslation = () => {
        if (!modalResult) return;

        // الحالة أ: تلخيص بوست عادي
        if (activeAction === 'summary_content') {
            const toastId = toast.loading(t('translating') || "Translating...");
            translateMutation.mutate({ content: modalResult }, {
                onSuccess: (res) => {
                    const translatedText = res.data.translated;
                    if (translatedText) {
                        toast.success(t('translate_success') || "Translated!", { id: toastId });
                        setModalResult(translatedText);
                    }
                },
                onError: () => toast.error(t('translate_error') || "Translation failed", { id: toastId })
            });
        } 
        // الحالة ب: ترجمة تبادلية لشرح الكود
        else if (activeAction === 'explain_code') {
            const nextLang = codeLangState === 'ar' ? 'en' : 'ar';
            handleExplainCode(nextLang); 
        }
    };

    const handleAction = (actionType) => {
        if (actionType === 'summarize_post') {
            handleSummarizePost(); 
        } else if (actionType === 'explain_code') {
            handleExplainCode(); 
        }
        setShow(false);
    };

    const hasCode = code && code.trim() !== "";

    return (
        <div className='relative' ref={menuRef}> 
            <motion.div
                className='flex items-center md:space-x-2'
                animate={!show ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ 
                    repeat: !show ? Infinity : 0, 
                    duration: 2, 
                    ease: "easeInOut" 
                }}
            >
                <button 
                    onClick={toggleMenu}
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
                        animate={{ opacity: 1, y: 10 }} 
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="absolute -top-44 md:end-24 end-10 bg-white dark:bg-navbar border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 flex flex-col justify-center z-[100] md:w-[200px] w-[180px] text-lg "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <button onClick={() => handleAction('best_answer')}
                                className="px-4 py-2 flex items-center justify-start w-full hover:font-semibold dark:hover:text-gray-700 transition-colors" >
                                <div className='flex flex-row justify-center items-center space-x-3'>
                                    <FaCheck className='text-yellow-400'/> 
                                    <p className='text-sm md:text-base'>{t('bestanswer')}</p>
                                </div> 
                            </button>
                        </div>
                        <div>
                            <button 
                                onClick={() => handleAction('summarize_post')}
                                className="px-4 py-2 flex items-center justify-start dark:hover:text-gray-700 hover:font-semibold w-full transition-colors"
                            >
                                <div className='flex flex-row justify-center items-center space-x-3'>
                                    <RiFlashlightFill className='text-yellow-400 size-5'/>
                                    <p className='text-sm md:text-base'>{t('summary')}</p>
                                </div>
                            </button>
                        </div>
                        {hasCode && (
                            <div>
                                <button 
                                    onClick={() => handleAction('explain_code')}
                                    className="px-4 py-2 flex items-center justify-start dark:hover:text-gray-700 hover:font-semibold w-full transition-colors"
                                >
                                    <div className='flex flex-row justify-center items-center space-x-3'>
                                        <FaCode className='text-yellow-400 size-5'/>
                                        <p className='text-sm md:text-base'>{t('explaine')}</p> 
                                    </div>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AiModal 
                open={openModal}
                result={modalResult}
                onclose={() => setOpenModal(false)}
                showTranslate={true} 
                onTranslate={handleToggleTranslation} 
                hideActionButtons={true} 
                isPending={summaryMutation.isPending || translateMutation.isPending || explainCodeMutation.isPending} 
            />
        </div>
    )
}

export default PostAi;
