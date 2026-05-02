import React, { useState, useRef, useMemo } from "react";
import { useimprovepost,usesummarizecode,usegeneratepost,
  useaddtags,usecategory} from "@/hook/UseMutationAi";
import { usecreatepost } from "./UseMutationCreatepost";
import{parsecontent} from '@/Utils/ParsedContent';
import { useQueryClient } from "@tanstack/react-query";
import { useAiAction } from "./useAiAction";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { UseMe } from "./UseQueryMe";

const CreatepostLogic = () => {
  const { data: currentUser } = UseMe();
  const queryClient = useQueryClient();
const infiniteData = queryClient.getQueryData(["posts", "all"]);
// نستخدم flatMap لدمج المنشورات من كل الصفحات في مصفوفة واحدة للبحث فيها
const allCachedPosts = infiniteData?.pages?.flatMap(page => page.results) || [];
const [displayCategory, setDisplayCategory] = useState("");
const myUsername = allCachedPosts.find(
  (p) => String(p.user?.id) === String(currentUser?.id)
)?.user?.username;
  const{t}=useTranslation();
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
const extractContent = (text) => {
  const tagRegex = /(^|\s)#([a-zA-Z0-9_]+)(?=\s|$)/g;

  const tags = [...text.matchAll(tagRegex)].map(m => m[2]);

  const cleanText = text.replace(tagRegex, "").trim();

  return { cleanText, tags };
};
const parsedcontent = useMemo(() => {
  const { cleanText } = extractContent(text);
  return parsecontent(cleanText);
}, [text]);
const resetForm = () => {
  setText(""); // تصفير النص
  setPreviewUrl([]); // حذف معاينة الصور
  setimages([]); // حذف ملفات الصور
  setCategory(""); // تصفير التصنيف البرمجي (المهم للنشر)
  setDisplayCategory(""); // تصفير التصنيف المعروض في الواجهة
  setTag([]); // تصفير التاغات
};

const handleUseAi = () => {

 if (aiType === "generate" || aiType === "improve") {
    // في حالة إعادة الصياغة أو التحسين، نستبدل النص القديم بالجديد
    // مع الحفاظ على الكود البرمجي إذا كان موجوداً
    setText(aiResult + (parsedcontent.code ? "\n\n" + parsedcontent.code : ""));}

 else if(aiType==="summarize"){
const newContent = parsedcontent.text + "\n\n" + aiResult + (parsedcontent.code ? "\n\n" + parsedcontent.code : "");
    setText(newContent);
 }
 
setshowModel(false);
};
/*
const handlePost = () => {
 const formData = new FormData();
console.log('hi')
 formData.append("content",parsedcontent.text);
 formData.append("code",parsedcontent.code);
 formData.append("code_language",parsedcontent.language)
 formData.append("post_type",category);
const finalTags = tags.length > 0 ? tags : extractTagsFromText(text);
  formData.append("tags", JSON.stringify(finalTags));
//اضافة عدة صور
 images.forEach((img)=>
   formData.append("images",img)
 );
  const toastId=toast.loading(t('create_post_loading'))
 createpostmutation.mutate(formData,{
   onSuccess: ()=>{
    queryClient.invalidateQueries({
      queryKey:["posts",category]
    })
 toast.success(t('create_post_success'), { id: toastId })
     previewUrl.forEach((u)=>
       u && URL.revokeObjectURL(u)
     );
     setText("");
     setPreviewUrl([]);
     setimages([]);
     setshow(false);
   },
  onError:() => {
      toast.error(t('create_post_error'), { id: toastId });
      }
 });

};*/
const handlePost = () => {
  if (!category) {
    toast.error(t('classify_post')); // تأكدي من إضافة المفتاح في ملف الترجمة
    return; // إيقاف تنفيذ الدالة ومنع النشر
  }
const extracted = extractContent(text || ""); 
  const cleanText = extracted?.cleanText || "";
  
  // 2. تنظيف النص من سطر التصنيف
  const textWithoutCategory = cleanText ? cleanText.replace(/\n*category:\s*\w+/gi, "").trim() : "";

  // 3. تحليل النص النهائي (فصل الكود عن النص)
  const finalParsed = parsecontent(textWithoutCategory);

  const formData = new FormData();
  
  // نرسل النص الصافي فقط (بدون الكود وبدون التاغات وبدون سطر التصنيف)
  formData.append("content", finalParsed.text); 
  formData.append("code", finalParsed.code);
  formData.append("code_language", finalParsed.language);
  formData.append("post_type", category || "general");

  // التاغات نرسلها كمصفوفة (JSON)
 const finalTags = tags || []; 

  finalTags.forEach((tag) => {
    formData.append("tags", tag); 
  });
console.log("🚀 جاري إرسال البيانات التالية:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  images.forEach((img) => formData.append("images", img));

  const tempId = `temp-${Date.now()}`;
  const optimisticPost = {
    id: tempId,
    user: {
  id: currentUser?.id,
  username: myUsername || "",
  personal_photo_url: currentUser?.personal_photo_url,
},
    created_at: new Date().toISOString(),
    content:  finalParsed.text,
    post_type: category || "general",
    is_following: false,
    code: parsedcontent.code || null,
    code_language: parsedcontent.language || null,
    media: previewUrl.map((url) => ({ image_url: url })),
    tags: finalTags,
    reaction_counts: {
      useful: 0,
      not_useful: 0,
      same_problem: 0,
      creative_solution: 0,
    },
    is_optimistic:true,
    user_reaction: null,
    total_comments: 0,
    suggestion_reason: "",
  };
/*
  queryClient.setQueryData(["posts", category], (old = []) => [
    optimisticPost,
    ...old,
  ]);*/
  // حطّ هاد
const activeCategory = category || "all";
queryClient.setQueriesData(
  { queryKey: ["posts"] },
  (old) => {
    // نتحقق أن البيانات موجودة ولها صفحات
    if (!old || !old.pages) return old;

    const newPages = [...old.pages];
    // نضيف المنشور في بداية مصفوفة النتائج داخل الصفحة الأولى فقط
    newPages[0] = {
      ...newPages[0],
      results: [optimisticPost, ...newPages[0].results],
    };

    return { ...old, pages: newPages };
  }
);

  const savedPreviewUrls = [...previewUrl];
  setText("");
  setPreviewUrl([]);
  setimages([]);
  setshow(false);

  const toastId = toast.loading(t("create_post_loading"));

  createpostmutation.mutate(formData, {
    onSuccess: () => {
      toast.success(t("create_post_success"), { id: toastId });
      savedPreviewUrls.forEach((u) => u && URL.revokeObjectURL(u));
   /*   queryClient.invalidateQueries({ queryKey: ["posts", category] });*/
   queryClient.invalidateQueries({ queryKey: ["posts"] });
resetForm();
    },
    onError: () => {
      toast.error(t("create_post_error"), { id: toastId });
     /* queryClient.setQueryData(["posts", category], (old = []) =>
        old.filter((p) => p.id !== tempId)
      );*/
queryClient.setQueriesData(
      { queryKey: ["posts"] },
      (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((p) => p.id !== tempId);
      }
    );
      setText(parsedcontent.text);
      setPreviewUrl(savedPreviewUrls);
    },
  });
};

const aiaction = useAiAction({
 improveMutation,
 generateMutation,
 summarizeMutation,
 addtagMutation,
 categoryMutation,
 setText,
 setaiResult,
 setaiType,
 setshowModel,
 parsedcontent,setCategory,displayCategory, setDisplayCategory, setTag
});

return {
  improveMutation,
 generateMutation,
 summarizeMutation,
 addtagMutation,
 categoryMutation,
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
 aiaction,displayCategory,setDisplayCategory,resetForm
};

};


export default CreatepostLogic