import React, { useState } from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { TbCopyCheck } from "react-icons/tb";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useTranslate } from '@/hook/UseMutationTrans';
import { motion } from 'framer-motion';

const BodyPost = ({ post, customClass = '',compact = false, onOpenPost }) => {
  const [showMore, setShowMore]       = useState(false)
  const [copy, setcopy]               = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const textContent  = post.content || "";
 
  const lines        = textContent.split('\n');
  const shouldTruncate = lines.length > 2 || textContent.length > 150;
  const displayContent = showMore || !shouldTruncate
    ? textContent
    : lines.slice(0, 2).join('\n').substring(0, 150) + "...";

  const handlecopy = () => {
    navigator.clipboard.writeText(post.code)
    setcopy(true)
    setTimeout(() => setcopy(false), 4000);
  }

  const isText =
    !post.is_optimistic &&
    post.content &&
    !post.code &&
    (!post.media || post.media.length === 0) &&
    (!post.tags  || post.tags.length  === 0) &&
    post.content.length < 100;

  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
  }, [post.code]);

  useEffect(() => {
    if (post.media?.length > 0) setCurrentImage(0);
  }, [post.media]);

  useEffect(() => {
    if (!post.media || post.media.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % post.media.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [post.media]);
const { t, i18n } = useTranslation();
  const translate = useTranslate();
  const [Translate,   setTranslate]   = useState(null);
  const [isTranslate, setisTransalte] = useState(false);

  const handletranslate = () => {
    if (isTranslate) { setisTransalte(false); return; }
    if (Translate)   { setisTransalte(true);  return; }
    translate.mutate(
      { post_id: post.id, text: post.content },
      {
        onSuccess: (res) => {
          const translatedContent = res.data.content;
          if (translatedContent) { setTranslate(translatedContent); setisTransalte(true); }
        },
      }
    );
  }

  const normalizedTags = (() => {
    const raw = post.tags;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.flatMap(t => String(t).split(/[,\s]+/))
                .map(t => t.replace(/[\[\]"']/g, "").trim())
                .filter(Boolean);
    }
    if (typeof raw === "string") {
      return raw.replace(/[\[\]"']/g, "").split(/[,\s]+/).map(t => t.trim()).filter(Boolean);
    }
    return [];
  })();
const visibleTags = compact
  ? normalizedTags.slice(0, 2)
  : normalizedTags;
  return (
<div
  onClick={compact ? onOpenPost : undefined}
  className={`
    w-full flex flex-col
    ${compact ? "cursor-pointer" : ""}
    ${compact ? "gap-4" : "gap-10"}
    ${customClass}
  `}
>

    

      {/* ── النص ── */}
{/* ── النص ── */}
<p
  className={`
    ${isText ? "text-lg md:text-xl font-semibold" : "text-sm md:text-base leading-relaxed"}
    dark:text-gray-100 whitespace-pre-wrap
    /* 🌟 قمنا بحذف شرط لغة الموقع لتجنب تدمير محاذاة المحتوى */
  `}
  style={{
    /* 🎯 هذه الخصائص هي السحر الفعلي لتحديد الاتجاه بناءً على لغة الكلمات داخل المنشور */
    direction: "auto",
    unicodeBidi: "plaintext", 
    textAlign: "start" /* 👈 يضمن محاذاة النصوص التلقائية (العربي يمين، الإنجليزي يسار) */
  }}
>
  {isTranslate ? Translate : displayContent}
  {!compact && shouldTruncate && !isTranslate && (
    <button
      onClick={(e) => {
        /* منع فتح المنشور عند النقر على زر اقرأ المزيد إذا كان compact */
        e.stopPropagation(); 
        setShowMore(!showMore);
      }}
      className="mx-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 font-normal underline-none"
    >
      {showMore ? t('showless') || "Show less" : t('showmore') || "Show more"}
    </button>
  )}
</p>
      

      {/* ── الكود ── */}
      {post.code && (
        <div className="bg-gray-900 dark:bg-gray-950 text-white rounded-lg w-full overflow-auto code-scroll">
          <div className="sticky top-0 bg-gray-900 dark:bg-gray-950 border-b border-gray-700 flex justify-between items-center px-3 py-1.5 z-10">
            <span className="text-sm text-gray-400">{post.code_language || "plaintext"}</span>
            <button onClick={handlecopy} className="bg-gray-700 p-1.5 rounded-md">
              {copy
                ? <TbCopyCheck className="text-sm " />
                : <FaRegCopy   className="text-sm" />
              }
            </button>
          </div>
          <pre className="p-2  text-xs md:text-[14px] max-h-52 overflow-auto">
            <code ref={codeRef} className={post.code_language}>{post.code}</code>
          </pre>
        </div>
      )}

      {/* ── الصور ── */}
      {post.media?.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <motion.img
            key={currentImage}
            src={post.media[currentImage].image_url}
            loading="lazy"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50 && currentImage < post.media.length - 1)
                setCurrentImage(prev => prev + 1);
              else if (info.offset.x > 50 && currentImage > 0)
                setCurrentImage(prev => prev - 1);
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
           className={`
rounded-xl w-full object-cover
${compact ? "max-h-[180px] " : "max-h-[380px]"}
`}
          />
          {post.media.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {post.media.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentImage ? "bg-gray-800 dark:bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

     {normalizedTags.length > 0 && (
  <div className="flex flex-wrap gap-2">
    
    {visibleTags.map((tag, index) => (
      <span
        key={index}
        className="text-xs md:text-sm text-gray-500 dark:text-gray-400"
      >
        #{tag.replace(/^#/, "")}
      </span>
    ))}

    {compact && normalizedTags.length > 2 && (
      <span className="text-xs text-gray-400">
        +{normalizedTags.length - 2}
      </span>
    )}

  </div>
)}
  {!compact && (
  <button
    onClick={handletranslate}
    disabled={translate.isPending}
    className="self-start text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-60"
  >
    {translate.isPending
      ? t('translating') + "…"
      : isTranslate ? t('see_original') : t('translate')}
  </button>
)}
    </div>
  )
}

export default BodyPost