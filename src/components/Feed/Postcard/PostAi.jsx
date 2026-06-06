import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { FaCode } from "react-icons/fa6";
import { RiFlashlightFill } from "react-icons/ri";
import { usesmartsummary } from '@/hook-temp/UseMutationsmartsummary';
import { useTranslatepost } from '@/hook-temp/UsemutationTranslatepost';
import { FaCheck } from "react-icons/fa";
import { useExplainecode } from '@/hook-temp/UseMutaionexplainecode';
import AiModal from '../AiModal';
import toast from 'react-hot-toast';
import { usebestanswer } from '@/hook-temp/UseMutationbestanswer';

const PostAi = ({ id, content, code, codeLanguage,postType, onBestAnswerFound }) => {
    // 🌟 إصلاح: تفكيك i18n هنا لقراءة اللغة الحالية للموقع بدون أخطاء
    const { t, i18n } = useTranslation();
    const [show, setShow] = useState(false);
    const menuRef = useRef(null); 
    const [openModal, setOpenModal] = useState(false);
    const [modalResult, setModalResult] = useState("");
    const [activeAction, setActiveAction] = useState(null);
    const [codeLangState, setCodeLangState] = useState("");
const [translatedResult, setTranslatedResult] = useState(""); // لتخزين النص المترجم
const [isTranslatedState, setIsTranslatedState] = useState(false);
    const summaryMutation = usesmartsummary();
    const translateMutation = useTranslatepost();
    const explainCodeMutation = useExplainecode();
    const bestAnswerMutation = usebestanswer();

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
        const toastId = toast.loading(t('smart_summary') || "Summarizing...");
        
        // 🌟 إصلاح: تعيين نوع الأكشن الحالي ليعرفه مودال الترجمة لاحقاً
        setActiveAction('summary_content');
        
        summaryMutation.mutate({
            content: content 
        }, {
            onSuccess: (res) => {
                const summaryText = res.data.summary; 
                if (summaryText) {
                   
                    setModalResult(summaryText); 
                    setTranslatedResult("");    // تصفير الترجمة السابقة
                    setIsTranslatedState(false)
                    setOpenModal(true); 
                }
            },
            onError: () => toast.error(t('summarize_error') || "Error occurred", { id: toastId })
        });
    };
    const handleBestAnswer = () => {
        const toastId = toast.loading(t('best_answer') || "Finding best answer...");
        setActiveAction('summary_content'); // لجعل الترجمة تستخدم الـ endpoint العادي المتوقع
        
        // 🌟 إرسال المعرف للباك إند
        bestAnswerMutation.mutate({ post_id: id }, {
            onSuccess: (res) => {
                const commentId = res.data.id; // استخراج معرف التعليق الفائز
                const reasonText = res.data.reason; // استخراج سبب الاختيار لتعليقه في المودال
                
                if (reasonText) {
                    
                    setModalResult(reasonText); 
                    setTranslatedResult("");    // تصفير الترجمة السابقة
                    setIsTranslatedState(false)// عرض الـ reason داخل المودال
                    setOpenModal(true);
                    
                    // تمرير المعرف للأب ليفتح السايد بانل ويعمل الهايلايت
                    if (onBestAnswerFound && commentId) {
                        onBestAnswerFound(commentId);
                    }
                }
            },
            onError: () => toast.error(t('best_answer_error') || "Failed to fetch best answer", { id: toastId })
        });
    };

    const handleExplainCode = (targetLang) => {
        if (!code) return;
        const toastId = toast.loading(t('explaine_code') || "Analyzing Code...");
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
                    
                    setModalResult(explanationText);
                    setOpenModal(true);
                }
            },
            onError: () => toast.error(t('explain_error') || "Failed to explain code", { id: toastId })
        });
    };
const handleToggleTranslation = () => {
    if (!modalResult) return;

    // إذا كان الأكشن لشرح الكود (هو يعمل تبادلياً عبر الباك إند عندكِ وهو صحيح)
    if (activeAction === 'explain_code') {
        const nextLang = codeLangState === 'ar' ? 'en' : 'ar';
        handleExplainCode(nextLang); 
        return;
    }

    // لملخص المنشور وأفضل إجابة (نص عادي):
    if (isTranslatedState) {
        // إذا كان مترجماً وضغط مجدداً، نعيد العرض للنص الأصلي دون طلب الباك إند
        setIsTranslatedState(false);
    } else {
        // إذا كان هناك ترجمة محفوظة مسبقاً، نعرضها فوراً
        if (translatedResult) {
            setIsTranslatedState(true);
            return;
        }

        // إذا كانت أول مرة يضغط ترجمة، نطلب الباك إند
        const toastId = toast.loading(t('translating') || "Translating...");
        translateMutation.mutate({ content: modalResult }, {
            onSuccess: (res) => {
                const translatedText = res.data.translated;
                if (translatedText) {
                 
                    setTranslatedResult(translatedText);
                    setIsTranslatedState(true);
                }
            },
            onError: () => toast.error(t('translate_error') || "Translation failed", { id: toastId })
        });
    }
};

   const handleAction = (actionType) => {
    if (actionType === 'summarize_post') {
        handleSummarizePost(); 
    } else if (actionType === 'explain_code') {
        handleExplainCode(); 
    } else if (actionType === 'best_answer') { // 👈 هذا هو الشرط المفقود الذي تسبب بالمشكلة
        handleBestAnswer(); 
    }
    setShow(false);
};

    const hasCode = code && code.trim() !== "";
    const isQuestion = postType === "question";
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
                    className='text-xs md:text-md text-gradient font-semibold cursor-pointer flex flex-row justify-center items-center space-x-1 outline-none'
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
                        className="absolute md:-top-20 -top-15 md:end-20 end-10 bg-white dark:bg-navbar border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 flex flex-col justify-center z-[100] md:min-w-[180px] min-w-[160px] text-sm "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isQuestion && (
                        <div>
                            <button onClick={() => handleAction('best_answer')}
                                className="px-4 py-1.5 flex items-center justify-start w-full hover:font-semibold dark:text-gray-700 dark:hover:text-gray-700 transition-colors" >
                                <div className='flex flex-row justify-center items-center space-x-3'>
                                    <FaCheck className='text-yellow-400'/> 
                                    <p className='text-xs md:text-sm'>{t('bestanswer')}</p>
                                </div> 
                            </button>
                        </div>)}
                        <div>
                            <button 
                                onClick={() => handleAction('summarize_post')}
                                className="px-4 py-1.5 flex items-center justify-start dark:text-gray-700 dark:hover:text-gray-700 hover:font-semibold w-full transition-colors"
                            >
                                <div className='flex flex-row justify-center items-center space-x-2'>
                                    <RiFlashlightFill className='text-yellow-400 size-5'/>
                                    <p className='text-xs md:text-sm'>{t('summary')}</p>
                                </div>
                            </button>
                        </div>
                        {hasCode && (
                            <div>
                                <button 
                                    onClick={() => handleAction('explain_code')}
                                    className="px-4 py-1.5 flex items-center justify-start dark:text-gray-700 dark:hover:text-gray-700 hover:font-semibold w-full transition-colors"
                                >
                                    <div className='flex flex-row justify-center items-center space-x-3'>
                                        <FaCode className='text-yellow-400 size-5'/>
                                        <p className='text-xs md:text-sm'>{t('explaine')}</p> 
                                    </div>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AiModal 
          
                open={openModal}
                result={isTranslatedState ? translatedResult : modalResult}
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
