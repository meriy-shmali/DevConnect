import React, { useState } from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { TbCopyCheck } from "react-icons/tb";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // أو أي theme
import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useTranslate } from '@/hook/UseMutationTrans';
import { motion } from 'framer-motion';
const BodyPost = ({post}) => {
  const[showMore,setShowMore]=useState(false)
  const[copy,setcopy]=useState(false)
  const [currentImage,setCurrentImage] = useState(0)
  const textContent = post.content || "";
  const lines = textContent.split('\n');
  const shouldTruncate = lines.length > 2 || textContent.length > 150;
  const displayContent = showMore || !shouldTruncate 
    ? textContent 
    : lines.slice(0, 2).join('\n').substring(0, 150) + "...";
  //دالة لنسخ الكود
  const handlecopy=()=>{
    navigator.clipboard.writeText(post.code)
    setcopy(true)
    setTimeout(()=>setcopy(false),2000);
  } //للتحكم بالنص  مثل الخط مثلا
  const isText =
  !post.is_optimistic &&
  post.content &&
  !post.code &&
  (!post.media || post.media.length === 0) &&
  (!post.tags || post.tags.length === 0) &&
  post.content.length < 100; // ← أضيفي شرط للطول مثلاً//اذا ما حطينا الطول يساوي صفر رح يعتبر انو في صورة حتى لو فاضية
  //يشير لعنصر بالكود 
  const codeRef = useRef(null);
  //منستنى حتى يجهز الكود بعدين منلونه
  useEffect(() => {
  if (codeRef.current) {
    hljs.highlightElement(codeRef.current);
  }
}, [post.code]);
//من اجل اعادة تعيين اول صورة  في كل مرة يتغير البوست لمنع الاخطاء في حال كان بوست يحوي 4 صور والتاني صورتين
useEffect(() => {
  if(post.media?.length>0){
    setCurrentImage(0);
  }
}, [post.media]);
//لتنفيذ التشغيل التلقائي للصور 
useEffect(() => {
  if (!post.media || post.media.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % post.media.length);
  }, 6000);// كل 6 ثواني
    return () => clearInterval(interval); // تنظيف عند unmount
}, [post.media]); 
const {t}= useTranslation();

const translate=useTranslate();
const[Translate,setTranslate]=useState(null);
const[isTranslate,setisTransalte]=useState(false);
const handletranslate=()=>{
  //اذا كان مترجم يرجع للاصلي
  if (isTranslate) {
    setisTransalte(false);
    return;
  }

  if (Translate) {
    setisTransalte(true);
    return;
  }

  translate.mutate(
    {
      post_id: post.id,
      text: post.content,
    },
    {
      onSuccess: (res) => {
        // الوصول للبيانات بناءً على الصورة المرفقة
        const translatedContent = res.data.content; 
        if (translatedContent) {
          setTranslate(translatedContent);
          setisTransalte(true);
        }
      },
    }
  );
  
}
const normalizedTags = (() => {
  const raw = post.tags;
  if (!raw) return [];

  // إذا كانت مصفوفة جاهزة
  if (Array.isArray(raw)) {
    return raw.flatMap(t => String(t).split(/[,\s]+/)) // تقسيم أي نص مدمج داخل المصفوفة
              .map(t => t.replace(/[\[\]"']/g, "").trim())
              .filter(Boolean);
  }

  // إذا كان نصاً (String)
  if (typeof raw === "string") {
    return raw
      .replace(/[\[\]"']/g, "") // إزالة الأقواس وعلامات التنصيص
      .split(/[,\s]+/)         // التقسيم بناءً على الفاصلة أو المسافة
      .map(t => t.trim())
      .filter(Boolean);
  }

  return [];
})();
  return (
    <div className='mt-7 w-full h-fit rounded-md p-3 flex-col space-y-6 items-start '
 >
    {/*text */}
    <p className={`${isText
  ? "md:text-3xl text-2xl font-semibold"
  : "md:text-2xl text-xl dark:text-gray-100"
} whitespace-pre-wrap`}
   style={{ 
    direction: 'rtl',      // الاتجاه الأساسي لليمين لأن المحتوى الغالب عربي
    unicodeBidi: 'plaintext', // الحل السحري لترتيب الكلمات الإنجليزية داخل الجمل العربية
    textAlign: 'start'     // يضمن بقاء النص على اليمين في العربي واليسار في الإنجليزي الصرف
  }}>
  {isTranslate ? Translate : displayContent}
  {shouldTruncate && !showMore && !isTranslate && (
          <button 
            onClick={() => setShowMore(true)} 
            className="mt-1 text-sm"
          >
           {t('showmore')}
          </button>
        )}
</p>

{post.code && (

<div className="bg-gray-900 dark:bg-gray-950 text-white rounded-lg overflow-hidden md:w-full w-[500px]">
<div className="sticky top-0 bg-gray-900 dark:bg-gray-950 border-b border-gray-700 flex justify-between items-center px-3 py-1">
   <div className='md:text-xl text-lg'>
    {post.code_language || "plaintext"}

  </div>
<button
onClick={handlecopy}
className="text-xs  bg-gray-700 p-2 rounded-md"
>
{copy?<TbCopyCheck className='md:text-[20px] text-[16px]' />:<FaRegCopy className='md:text-[20px] text-[16px]' />}
</button>
</div>
<pre className="p-4 overflow-auto max-h-60 code-scroll">
<code ref={codeRef} className={post.code_language}>
{post.code}
</code>
</pre>

</div>

)}
{/* IMAGES */}
{/* حطينا اشارة الاستفهام لان بدونها رح يكون الشرط عطول صح */}
{post.media?.length > 0 && (

<div className="w-fit h-fit">

<motion.img
  key={currentImage}
  src={post.media[currentImage].image_url}
  loading='lazy'
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x < -50 && currentImage < post.media.length - 1) {
      setCurrentImage(prev => prev + 1);
    } else if (info.offset.x > 50 && currentImage > 0) {
      setCurrentImage(prev => prev - 1);
    }
  }}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
  transition={{ duration: 0.8 }}
  className="rounded-xl md:w-full w-[500px]"
/>

{/* dots */}
{post.media.length>1 &&(
<div className="flex justify-center gap-2 mt-2">

{post.media?.map((img,index)=>(

<div
key={img}
onClick={()=>setCurrentImage(index)}
className={`md:w-3 md:h-3 w-2 h-2 rounded-full cursor-pointer ${
index===currentImage ? "bg-black":"bg-gray-500"
}`}
/>
))}</div>)}</div>)}
{/*Tags */}
{normalizedTags.length > 0 && (
<div className="flex items-center gap-6">
{/*Tags */}
{normalizedTags.length > 0 && (
  <div className="flex items-center gap-3 flex-wrap"> 
    {normalizedTags.map((tag, index) => {
      

      return (
        <div
          key={index}
          className="md:text-xl text-lg text-gray-700 dark:text-gray-300 flex-wrap"
        >
          #{tag.replace(/^#/, "")}
        </div>
      );
    })}
  </div>
)}
</div>)}
<button className='text-sm text-gray-600 dark:text-gray-400'onClick={handletranslate} disabled={translate.isPending}>  {translate.isPending 
          ?   t('translating') + "..."
          : (isTranslate ? t('see_original') : t('translate'))
        }</button>




    </div>
  )
}

export default BodyPost