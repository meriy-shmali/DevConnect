import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import {Messages} from '../Messages/Messages'
import AIAssistant from "@/components/Feed/AIAssistant";
import { useimprovepost,usesummarizecode,usegeneratepost,
  useaddtags,usecategory} from "@/hook/UseMutationAi";
import { motion, AnimatePresence } from "framer-motion";
import { usecreatepost } from "./UseMutationCreatepost";
import{parsecontent} from '@/Utils/ParsedContent';

import { AiAction } from "@/hook/AiAction";
import toast from "react-hot-toast";

const CreatepostLogic = () => {
 const createpostmutation = usecreatepost();

// AI
const improveMutation = useimprovepost();
const generateMutation = usegeneratepost();
const summarizeMutation = usesummarizecode();
const addtagMutation = useaddtags();
const categoryMutation = usecategory();



const [text, setText] = useState("");
const [images, setimages] = useState([]);
const [previewUrl, setPreviewUrl] = useState([]);
const [show,setshow]=useState(false);

const [aiResult,setaiResult]=useState('');
const [aiType,setaiType]=useState(null);
const [showModel,setshowModel]=useState(false);

const [tags,setTag]=useState([]);
const [category,setCategory]=useState("");

const uploadRef = useRef(null);

const handleImageUpload = (e) => {
 const selected = Array.from(e.target.files || []);
 if (selected.length === 0) return;

 const onlyImages = selected.filter((f) =>
   f.type.startsWith("image/")
 );

 setimages((prev)=>[...prev,...onlyImages]);

 const newpreviews = onlyImages.map((img)=>
   URL.createObjectURL(img)
 );

 setPreviewUrl((prev)=>[...prev,...newpreviews]);

 e.target.value=null;
};

const extractTagsFromText = (text) => {
 const matches = text.match(/#\w+/g) || [];
 return [...new Set(matches.map((t) => t.slice(1)))];
};

const removeImage = (index) => {
 if(previewUrl[index]){
   URL.revokeObjectURL(previewUrl[index]);
 }

 setimages((prev)=>prev.filter((_,i)=>i!==index));
 setPreviewUrl((prev)=>prev.filter((_,i)=>i!==index));
};

const parsedcontent = useMemo(() =>
 parsecontent(text)
,[text]);

const handleUseAi = () => {

 if(aiType==="improve"){
   setText(aiResult);
 }

 else if(aiType==="summarize"){
   setText(parsedcontent.text + aiResult);
 }

};

const handlePost = () => {
const toastId=toast.loading();
 const formData = new FormData();
console.log('hi')
 formData.append("text",parsedcontent.text);
 formData.append("code",parsedcontent.code);
 formData.append("category",category);

 const finalTags =
   tags.length > 0 ? tags : extractTagsFromText(text);

 finalTags.forEach((tag)=>
   formData.append("tags[]", tag)
 );

 images.forEach((img)=>
   formData.append("images",img)
 );

 createpostmutation.mutate(formData,{
   onSuccess: ()=>{
     setText("");
     toast(Messages.login_success,{id:toastId});
     

     previewUrl.forEach((u)=>
       u && URL.revokeObjectURL(u)
     );
     setText("");
     setPreviewUrl([]);
     setimages([]);
     setshow(false);
   }
 });

};

const aiaction = AiAction({
 improveMutation,
 generateMutation,
 summarizeMutation,
 addtagMutation,
 categoryMutation,
 setText,
 setaiResult,
 setaiType,
 setshowModel,
 parsedcontent,
});

return {
 
 text,
 setText,
 images,
 previewUrl,
 show,
 setshow,
 aiResult,
 aiType,
 showModel,
 setshowModel,
 tags,
 setTag,
 category,
 setCategory,
 uploadRef,
 handleImageUpload,
 removeImage,
 parsedcontent,
 handleUseAi,
 handlePost,
 aiaction
};

};


export default CreatepostLogic