import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs";
import AIAssistant from "./AIAssistant";
import { useimprovepost,usesummarizecode,usegeneratepost,
  useaddtags,usecategory} from "@/hook/UseMutationAi";
import { motion, AnimatePresence } from "framer-motion";
import { usecreatepost } from "@/hook/UseMutationCreatepost";
import{parsecontent} from '@/Utils/ParsedContent';
import Buttons from "../ui/ButtonGroup";
import { AiAction } from "@/hook/AiAction";
const Createpost = () => {
  const createpostmutation=usecreatepost();
  //ai mutation
  const improveMutation=useimprovepost();
  const generateMutation=usegeneratepost();
  const summarizeMutation=usesummarizecode();
  const addtagMutation=useaddtags();
  const categoryMutation=usecategory();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [images, setimages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const[show,setshow]=useState(false);
// ai assistant
const[aiResult,setaiResult]=useState('');
const[aiType,setaiType]=useState(null);
const[showModel,setshowModel]=useState(false);
const[tags,setTag]=useState([]);
const[category,setCategory]=useState("")
  const uploadRef = useRef(null); 
  const handleImageUpload = (e) => {
    const selected=Array.from(e.target.files||[]);
    if (selected.length==0) return;
     const onlyImages = selected.filter((f) => f.type.startsWith("image/"));
     setimages((prev)=>[...prev,...onlyImages]);
     const newpreviews=onlyImages.map((img)=>URL.createObjectURL(img));
     setPreviewUrl((prev)=>[...prev,...newpreviews]);
     e.target.value=null;
    
  }
  //handle extracttags
  const extractTagsFromText = (text) => {
  const matches = text.match(/#\w+/g) || [];
  return [...new Set(matches.map((t) => t.slice(1)))];
};
     //remove images
     const removeImage=(index)=>{
     if(previewUrl[index])
     {
      URL.revokeObjectURL(previewUrl[index]);
     }
   setimages((prev)=>prev.filter((__dirname,i)=>i!==index));
  setPreviewUrl((prev)=>prev.filter((__dirname,i)=>i!==index));};
 //---------parseconent-------
 
 const parsedcontent=useMemo(()=>
  parsecontent(text)
 ,[text])
//handle useai
const handleUseAi=()=>{
if(aiType=="improve"){
  setText(aiResult);
}
else if(aiType=="summarize"){
  setText(parsedcontent.text+aiResult);
}
}
  // ---------- SEND POST ----------
  const handlePost = () => {
    
      const formData = new FormData();
    formData.append("text",parsedcontent.text);
    formData.append("code",parsedcontent.code);
    formData.append("category",category)
    const finalTags =
  tags.length > 0 ? tags : extractTagsFromText(text);

finalTags.forEach((tag) =>
  formData.append("tags[]", tag)
);

    images.forEach((img)=>formData.append("images",img))
     createpostmutation.mutate(formData,{
       onSuccess: ()=>{
      setText("");
      previewUrl.forEach((u) => u && URL.revokeObjectURL(u));
      setPreviewUrl([]);
      setimages([]);
     setshow(false);}
     })
  };
   const aiaction=AiAction({improveMutation,
  generateMutation,
  summarizeMutation,
  addtagMutation,
  categoryMutation,
  setText,
  setaiResult,
  setaiType,
  setshowModel,
  parsedcontent,})

  return (
    <div>
      <div className="w-[428px] bg-gradient-background rounded-[55px] shadow-xl/45 ">
        <div className="flex-col justify-center items-center mt-8 p-8 space-y-14 pb-36">
          <p className="text-white text-[48px] text-center">{t("create")}</p>

          {/* TEXT */}
          <Textarea
            placeholder="Share your ideas."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-white"
          />
        
         {/*showmodel */}
         {
          showModel&&(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-[500px]">
      <Textarea value={aiResult} />
    <Button className='bg-blue-button text-text-button md:text-[25px]' onClick={handleUseAi}>{t('use')}</Button>
    <Button className='bg-cancel-button text-text-button text-[24px]'onClick={()=>setshowModel(false)}>{t('cancel')}</Button>
    </div>
  </div>
          )
         }
          {/* PREVIEW AREA */}
          {previewUrl.length>0 && (
            <div className="flex items-center gap-4 p-3 rounded-lg shadow">
              {previewUrl.map ((src,index)=>(
              <div key={index}>
                <img
                  src={src}
                  className="w-20 h-20 object-cover rounded"
                />
<button onClick={()=>removeImage(index)}>
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
            ref={uploadRef}
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />

          {/* BUTTONS */}
          <div className="flex space-x-6">
            {/* UPLOAD FILE BUTTON */}
            <Button onClick={() => uploadRef.current.click()}>
              <RiImageAddFill className="text-white size-[40px]" />
            </Button>

            {/* POST */}
            <Button
              className="text-white bg-post-button w-[100px] h-[41px] text-[24px]"
              onClick={handlePost}
            >
              {t("post")}
            </Button>

            {/* CANCEL */}
            {text.trim() !== "" && (
              <Button
                className="text-white bg-cancel w-[100px] h-[41px] text-[24px]"
                onClick={() => {
                  setText("");
                  removeImage();
                }}
              >
                {t("cancel")}
              </Button>
            )}
          </div>

          <div className="text-white text-[24px] text-center leading-11">
            {t("help")}
            <Button className="text-[22px] border-2 rounded-[50px] ml-4 pt-1 pb-1" onClick={()=>setshow(!show)}>
              {t("ai")} <BsStars className="size-[22px]" />
            </Button>
            <AnimatePresence>
            {
            show&&(
             <motion.div    initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.2 }}>
              <AIAssistant improve={aiaction.improve} generate={aiaction.generate}
              summarize={aiaction.summarize} addtags={()=>aiaction.addTags(text)} category={()=>aiaction.categorize(text)}/>
              </motion.div>
            )
            }</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createpost;
