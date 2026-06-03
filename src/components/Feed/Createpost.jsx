import React from "react";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs"; 

import AIAssistant from "./AIAssistant";
import { motion, AnimatePresence, spring, color } from "framer-motion";
import CreatepostLogic from "@/hook/CreatepostLogic";
import { useNavigate } from "react-router-dom";
import CreatepostMobile from "./CreatepostMobile";
import { MdPostAdd } from "react-icons/md";
import { useRef, useEffect } from "react";
import AISidePanel from "./AISidepanel";
import AiModal from './AiModal';
const Createpost = () => {
   const containerRef = useRef(null);
  const post=CreatepostLogic();
const { t, i18n } = useTranslation();
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target)
    ) {
      post.setshow(false); // يسكر AI Assistant
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    <div>
     
    <div ref={containerRef} className="hidden md:block"  onClick={()=>post.setshow(false)}>
      <div  className={`w-[310px] pb-10 bg-gradient-background rounded-[50px] shadow-lg/25 ${
    i18n.language === "ar" ? "mb-8" : ""
  }`}>
        <div className="flex-col justify-center items-center mt-2 p-8 space-y-8 pb-10">
          <p className="text-white text-3xl text-center title-font">{t("create")}</p>

          {/* TEXT */}
          <Textarea
            placeholder={t('share')}
            value={`${post.text}${post.displayCategory ? `\n\ncategory: ${post.displayCategory}` : ""}`}
            onChange={(e) => post.setText(e.target.value)}
            className="bg-white md:text-md  dark:bg-gray-100 h-[60px] overflow-y-auto placeholder:text-xs placeholder:text-gray-400 "
          />
      
      
          {/* PREVIEW AREA */}
          {post.previewUrl.length>0 && (
            <div className="flex items-center gap-4 h-fit   -mt-2 mb-1">
              {post.previewUrl.map ((src,index)=>(
              <div key={index}>
                <img
                  src={src}
                  className="w-10 h-10 object-cover rounded"
                />
<button onClick={()=>post.removeImage(index)}>
                <FaRegTrashAlt className="text-red-500 hover:text-red-700 text-md mt-2 text-center" />
              </button>
              </div>
              ) )
              }        
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
          <div className="flex gap-6">
            {/* UPLOAD FILE BUTTON */}
            <Button onClick={() => post.uploadRef.current.click()}>
              <RiImageAddFill className="text-white size-[28px]" />
            </Button>

            {/* POST */}
            <Button
              className="text-white bg-post-button hover:bg-hover-purple w-fit h-fit py-1 text-md"
              onClick={post.handlePost}
            >
              {t("post")}
            </Button>

            {/* CANCEL */}
            {post.text.trim() !== "" && (
              <Button
                className="text-white bg-cancel w-fit h-fit py-1 text-md"
                onClick={() => {
                  post.resetForm();
                }}
              >
                {t("cancel")}
              </Button>
            )}
          </div>

          <div className="flex items-start justify-center gap-3 flex-wrap">
             <div className='  text-[17px]  text-gray-200 text-center leading-7 ' >
            {t("help")}
            <Button className="text-[16px] hover:bg-white/15 ms-2 border-2 rounded-full mt-2" onClick={(e) => {
              e.stopPropagation();
    post.setshow(prev => !prev);
  }}>
              {t("ai")} <BsStars className="size-sm text-amber-300" />
            </Button></div>
         <AISidePanel
  open={post.show}
  onClose={() => post.setshow(false)}
>
  <AIAssistant
  type="sidepanel"
  onClose={()=>post.setshow(false)}
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
    
    <AiModal open={post.showModel}
     result={post.aiResult}
     onuse={post.handleUseAi}
     onclose={()=>post.setshowModel(false)}
     hideActionButtons={false} 
     showTranslate={post.aiType === "summarize"} 
  // 🌟 تمرير دالة الترجمة المستخرجة من الهوك
  onTranslate={post.aiaction.toggleTranslation}
     onRegenerate={() => post.aiaction.regenerate(post.aiType)}
  // نمرر حالة التحميل بناءً على النوع الحالي ليظهر الانيميشن على الزر
  isPending={
    post.improveMutation.isPending || 
    post.generateMutation.isPending || 
    post.summarizeMutation.isPending
  } />
    </div>
  );
}

export default Createpost;