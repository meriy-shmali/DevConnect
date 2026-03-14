import React from "react";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs";
import AIAssistant from "./AIAssistant";
import { motion, AnimatePresence } from "framer-motion";
import CreatepostLogic from "@/hook/CreatepostLogic";
import { useNavigate } from "react-router-dom";
import CreatepostMobile from "./CreatepostMobile";
import { MdPostAdd } from "react-icons/md";
const Createpost = () => {
  const navigate=useNavigate();
  const post=CreatepostLogic();
  const { t } = useTranslation();
  return (
    <div className=" sticky">
    <div className="hidden md:block">
      <div className="w-[428px] bg-gradient-background rounded-[55px] shadow-xl/45 ">
        <div className="flex-col justify-center items-center mt-8 p-8 space-y-14 pb-36">
          <p className="text-white text-[48px] text-center">{t("create")}</p>

          {/* TEXT */}
          <Textarea
            placeholder={t('share')}
            value={post.text}
            onChange={(e) => post.setText(e.target.value)}
            className="bg-white"
          />
        
         {/*showmodel */}
         {
          post.showModel&&(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-[500px]">
      <Textarea value={post.aiResult} />
    <Button className='bg-blue-button text-text-button md:text-[25px]' onClick={post.handleUseAi}>{post.t('use')}</Button>
    <Button className='bg-cancel-button text-text-button text-[24px]'onClick={()=>post.setshowModel(false)}>{t('cancel')}</Button>
    </div>
  </div>
          )
         }
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
              <RiImageAddFill className="text-white size-[40px]" />
            </Button>

            {/* POST */}
            <Button
              className="text-white bg-post-button w-[100px] h-[41px] text-[24px]"
              onClick={post.handlePost}
            >
              {t("post")}
            </Button>

            {/* CANCEL */}
            {post.text.trim() !== "" && (
              <Button
                className="text-white bg-cancel w-[100px] h-[41px] text-[24px]"
                onClick={() => {
                  post.setText("");
                  post.removeImage();
                }}
              >
                {t("cancel")}
              </Button>
            )}
          </div>

          <div className="text-white text-[24px] text-center leading-11">
            {t("help")}
            <Button className="text-[22px] border-2 rounded-[50px] ml-4 pt-1 pb-1" onClick={()=>post.setshow(!post.show)}>
              {t("ai")} <BsStars className="size-[22px] text-amber-300" />
            </Button>
            <AnimatePresence> 
            {
           post. show&&(
             <motion.div    initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.2 }}>
              <AIAssistant improve={post.aiaction.improve} generate={post.aiaction.generate}
              summarize={post.aiaction.summarize} addtags={()=>post.aiaction.addTags(post.text)} category={()=>post.aiaction.categorize(post.text)}/>
              </motion.div>
            )
            }</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
    <div className="md:hidden flex justify-center">
    <div onClick={()=>navigate("/post-mobile")} className="border-2 border-gray-500 mt-16 w-[400px] p-2 rounded-4xl pl-5 text-xl text-gray-500 flex align-middle">{t('create')}</div>
    
 
    </div>
    </div>
  );
}

export default Createpost;
