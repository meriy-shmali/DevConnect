import React, { useState } from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { TbCopyCheck } from "react-icons/tb";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // أو أي theme
import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useTranslate } from '@/hook/UseMutationTrans';
const BodyPost = ({post}) => {
  const[copy,setcopy]=useState(false)
  const [currentImage,setCurrentImage] = useState(0)
  //دالة لنسخ الكود
  const handlecopy=()=>{
    navigator.clipboard.writeText(post.code)
    setcopy(true)
    setTimeout(()=>setcopy(false),2000);
  } //للتحكم بالنص  مثل الخط مثلا
  const isText =
  post.text &&
  !post.code &&
  (!post.images || post.images.length === 0)&&(!post.tags||post.tags.length===0);//اذا ما حطينا الطول يساوي صفر رح يعتبر انو في صورة حتى لو فاضية
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
  if(post.images?.length>0){
    setCurrentImage(0);
  }
}, [post.images]);
//لتنفيذ التشغيل التلقائي للصور 
useEffect(() => {
  if (!post.images || post.images.length === 0) return;

  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % post.images.length);
  }, 6000);// كل 6 ثواني
    return () => clearInterval(interval); // تنظيف عند unmount
}, [post.images]); 
const {t}= useTranslation();

const translate=useTranslate();
const[Translate,setTranslate]=useState(null);
const[isTranslate,setisTransalte]=useState(false);
const handletranslate=()=>{
  //اذا كان مترجم يرجع للاصلي
  if(isTranslate)
{setisTransalte(false)
  return;
}//اذا مترجم قبل ما بعيد الطلب
if(Translate)
{setisTransalte(true)
  return;
}
translate.mutate({
  postId:post.id,
 text:post.text,
},{
  onSuccess:(res)=>{
    setTranslate(res.data.translate);
    setisTransalte(true)
  }
})


  
}
  return (
    <div className='mt-7 w-[800px] h-fit rounded-md p-3 flex-col space-y-6 items-start '>
    {/*text */}
    {isTranslate?translate:post.text &&(
      <p className={`${isText? "text-3xl font-semibold":"text-2xl"}`}>{post.text}</p>
    )}

{post.code && (

<div className="bg-gray-900 text-white rounded-lg overflow-hidden ">
<div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 flex justify-between items-center px-3 py-1">
   <div className='text-xl'>
    {post.codeLanguage || "plaintext"}

  </div>
<button
onClick={handlecopy}
className="text-xs  bg-gray-700 p-2 rounded-md"
>
{copy?<TbCopyCheck className='text-[20px]' />:<FaRegCopy className='text-[20px]' />}
</button>
</div>
<pre className="p-4 overflow-auto max-h-60 code-scroll">
<code ref={codeRef} className={post.codeLanguage}>
{post.code}
</code>
</pre>

</div>

)}
{/* IMAGES */}
{/* حطينا اشارة الاستفهام لان بدونها رح يكون الشرط عطول صح */}
{post.images?.length > 0 && (

<div className="w-fit h-fit">

<img
src={post.images[currentImage]}
className="rounded-xl w-full"
/>

{/* dots */}

<div className="flex justify-center gap-2 mt-2">

{post.images.map((img,index)=>(

<div
key={img}
onClick={()=>setCurrentImage(index)}
className={`w-3 h-3 rounded-full cursor-pointer ${
index===currentImage ? "bg-black":"bg-gray-500"
}`}
/>
))}</div></div>)}
{/*Tags */}
<div className="flex items-center gap-6">
  {post.tags?.map((tag,index) => (
    <div
      key={index}
      className="text-xl text-gray-700 flex-wrap"
    >
      {tag}
    </div>
  ))}
</div>
<button className='text-sm text-gray-600'onClick={handletranslate}>{isTranslate?t('see_original'):t('translate')}</button>




    </div>
  )
}

export default BodyPost