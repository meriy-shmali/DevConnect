import React, { useState } from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { TbCopyCheck } from "react-icons/tb";
const BodyPost = ({post}) => {
  const[copy,setcopy]=useState(false)
  const [currentImage,setCurrentImage] = useState(0)
  //دالة لنسخ الكود
  const handlecopy=()=>{
    navigator.clipboard.writeText(post.code)
    setcopy(true)
  } //للتحكم بالنص  مثل الخط مثلا
  const isText=post.text&&!post.code&&!post.images;
  return (
    <div className='mt-7 w-[800px] h-fit rounded-md p-3 flex-col space-y-6 items-start '>
    {/*text */}
    {post.text&&(
      <p className={`${isText? "text-3xl font-semibold":"text-2xl"}`}>{post.text}</p>
    )}

{post.code && (

<div className="relative bg-gray-900 text-white p-4 rounded-lg overflow-auto max-h-60 code-scroll ">

<button
onClick={handlecopy}
className="absolute top-2 right-2 text-xs bg-gray-700 p-2 rounded-md"
>
{copy?<TbCopyCheck className='text-[20px]' />:<FaRegCopy className='text-[20px]' />}
</button>
<pre>
<code>
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

{post.images.map((_,index)=>(

<div
key={index}
onClick={()=>setCurrentImage(index)}
className={`w-2 h-2 rounded-full cursor-pointer ${
index===currentImage ? "bg-black":"bg-gray-500"
}`}
/>

))}

</div>

</div>

)}


    </div>
  )
}

export default BodyPost