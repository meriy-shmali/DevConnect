import React from "react";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs";
import AIAssistant from "./AIAssistant";
import { motion, AnimatePresence, spring } from "framer-motion";
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
  const { t } = useTranslation();
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
      <div className="w-[428px] bg-gradient-background rounded-[55px] shadow-xl/45">
        <div className="flex-col justify-center items-center mt-2 p-8 space-y-12 pb-40">
          <p className="text-white text-[45px] text-center">{t("create")}</p>

          {/* TEXT */}
          <Textarea
            placeholder={t('share')}
            value={`${post.text}${post.displayCategory ? `\n\ncategory: ${post.displayCategory}` : ""}`}
            onChange={(e) => post.setText(e.target.value)}
            className="bg-white dark:bg-gray-100 h-20 overflow-y-auto "
          />
      
      
          {/* PREVIEW AREA */}
          {post.previewUrl.length>0 && (
            <div className="flex items-center gap-4 p-3 rounded-lg shadow">
              {post.previewUrl.map ((src,index)=>(
              <div key={index}>
                <img
                  src={src}
                  className="w-20 h-20 object-cover rounded"
                />
<button onClick={()=>post.removeImage(index)}>
                <FaRegTrashAlt className="text-red-500 hover:text-red-700 text-[25px] mt-2 text-center" />
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
          <div className="flex space-x-6">
            {/* UPLOAD FILE BUTTON */}
            <Button onClick={() => post.uploadRef.current.click()}>
              <RiImageAddFill className="text-white size-[36px]" />
            </Button>

            {/* POST */}
            <Button
              className="text-white bg-post-button hover:bg-hover-purple w-[80px] h-[40px] text-[22px]"
              onClick={post.handlePost}
            >
              {t("post")}
            </Button>

            {/* CANCEL */}
            {post.text.trim() !== "" && (
              <Button
                className="text-white bg-cancel w-[100px] h-[41px] text-[24px]"
                onClick={() => {
                  post.resetForm();
                }}
              >
                {t("cancel")}
              </Button>
            )}
          </div>

          <div className="text-white text-[24px] text-center leading-11 ">
            {t("help")}
            <Button className="text-[22px] border-2 rounded-[50px] ml-4 pt-1 pb-1" onClick={(e) => {
              e.stopPropagation();
    post.setshow(prev => !prev);
  }}>
              {t("ai")} <BsStars className="size-[22px] text-amber-300" />
            </Button>
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
