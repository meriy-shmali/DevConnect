import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs"; 

import AIAssistant from "./AIAssistant";
import { motion, AnimatePresence } from "framer-motion";
import CreatepostLogic from "@/hook/CreatepostLogic";
import AISidePanel from "./AISidepanel";
import AiModal from './AiModal';

const Createpost = () => {
  const containerRef = useRef(null);
  const post = CreatepostLogic();
  const { t, i18n } = useTranslation();

  // إغلاق الذكاء الاصطناعي عند الضغط خارج الكرت بالكامل
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        post.setshow(false); // إغلاق الـ AI Assistant عند الضغط بالخارج
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [post]);

  return (
    <div>
      <div ref={containerRef} className="hidden md:block">
        
        {/* ضبط مرونة الـ width للتناسب التام مع اللابتوب */}
        <div className={`w-full max-w-[310px] xl:max-w-[320px] pb-12 bg-gradient-background rounded-[40px] shadow-lg/25 transition-all duration-300 ${
          i18n.language === "ar" ? "mb-8" : ""
        }`}>
          <div className="flex flex-col justify-center items-center mt-2 p-6 xl:p-8 space-y-7 pb-8">
            <p className="text-white text-3xl text-center title-font">{t("create")}</p>

            {/* TEXTAREA - ربط مباشر وصحيح مع الـ state */}
            <Textarea
              placeholder={t('share')}
              value={post.text}
              onChange={(e) => post.setText(e.target.value)}
              className="bg-white md:text-md dark:bg-gray-100 h-[70px] overflow-y-auto placeholder:text-xs placeholder:text-gray-400 rounded-[10px] border-none focus:ring-2 focus:ring-purple-400"
            />
            
            {/* عرض الـ Category الحالية إذا وُجدت تحت الصندوق كعلامة صغيرة (Badge) بدلاً من حشرها داخل النص */}
            {post.displayCategory && (
              <div className="w-full flex justify-start -mt-4">
                <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  {t("category")}: {post.displayCategory}
                </span>
              </div>
            )}
        
            {/* PREVIEW AREA - تم استبدال الكلاس هنا بـ preview-scroll المخصص النحيف والشفاف */}
            {post.previewUrl.length > 0 && (
              <div className="flex items-center gap-3 h-fit w-full overflow-x-auto py-1 preview-scroll -mt-2">
                {post.previewUrl.map((src, index) => (
                  <div key={index} className="relative group shrink-0">
                    <img
                      src={src}
                      className="w-12 h-12 object-cover rounded-xl border border-white/20 shadow"
                      alt="preview"
                    />
                    <button 
                      onClick={() => post.removeImage(index)}
                      className="absolute -top-1 -end-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow transition-all transform scale-90 group-hover:scale-100"
                    >
                      <FaRegTrashAlt className="size-[10px]" />
                    </button>
                  </div>
                ))}        
              </div>
            )}

            {/* HIDDEN FILE INPUT */}
            <input
              type="file"
              ref={post.uploadRef}
              className="hidden"
              onChange={post.handleImageUpload}
              accept="image/*"
            />

            {/* BUTTONS */}
            <div className="flex gap-4 w-full justify-center items-center">
              {/* UPLOAD FILE BUTTON */}
              <Button 
                onClick={() => post.uploadRef.current.click()}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-[10px] p-2.5"
              >
                <RiImageAddFill className="text-white size-[22px]" />
              </Button>

              {/* POST */}
              <Button
                className="text-white bg-post-button hover:bg-hover-purple px-3 py-2 rounded-[10px] text-sm font-medium transition-colors shadow-md"
                onClick={post.handlePost}
              >
                {t("post")}
              </Button>

              {/* CANCEL */}
              {post.text.trim() !== "" && (
                <Button
                  className="text-white bg-cancel/80 hover:bg-cancel px-3 py-2 rounded-[10px] text-sm font-medium transition-colors"
                  onClick={() => post.resetForm()}
                >
                  {t("cancel")}
                </Button>
              )}
            </div>

            {/* AI TRIGGER BLOCK */}
            <div className="flex items-start justify-center gap-2 flex-wrap pt-2 w-full">
              <div className='text-[18px] xl:text-[15px] text-gray-200 text-center leading-7'>
                {t("help")}
                <Button 
                  className="text-[16px] bg-white/10 hover:bg-white/20 ms-2 border border-white/30 rounded-full py-1 h-fit transition-all transform hover:scale-105" 
                  onClick={(e) => {
                    e.stopPropagation();
                    post.setshow(prev => !prev);
                  }}
                >
                  {t("ai")} <BsStars className="size-sm text-amber-300 ms-1 animate-pulse" />
                </Button>
              </div>

              {/* SIDE PANEL FOR AI */}
              <AISidePanel open={post.show} onClose={() => post.setshow(false)}>
                <AIAssistant
                  type="sidepanel"
                  onClose={() => post.setshow(false)}
                  improve={post.aiaction.improve}
                  generate={post.aiaction.generate}
                  summarize={post.aiaction.summarize}
                  addtags={() => post.aiaction.addTags(post.text)}
                  category={() => post.aiaction.categorize(post.text)}
                  improveM={post.improveMutation}
                  generateM={post.generateMutation}
                  summarizeM={post.summarizeMutation}
                  addM={post.addtagMutation}
                  categoryM={post.categoryMutation}
                />
              </AISidePanel>
            </div>

          </div>
        </div>
      </div>
      
      {/* MODAL WINDOW FOR AI ACTIONS */}
      <AiModal 
        open={post.showModel}
        result={post.aiResult}
        onuse={post.handleUseAi}
        onclose={() => post.setshowModel(false)}
        hideActionButtons={false} 
        showTranslate={post.aiType === "summarize"} 
        onTranslate={post.aiaction.toggleTranslation}
        onRegenerate={() => post.aiaction.regenerate(post.aiType)}
        isPending={
          post.improveMutation.isPending || 
          post.generateMutation.isPending || 
          post.summarizeMutation.isPending
        } 
      />
    </div>
  );
};

export default Createpost;