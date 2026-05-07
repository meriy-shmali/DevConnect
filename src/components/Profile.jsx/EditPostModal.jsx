import CreatepostLogic from '@/hook/CreatepostLogic';
import React , { useState,useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Buttons from '../ui/ButtonGroup';
import { BsStars } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import AIAssistant from '../Feed/AIAssistant';
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import AiModal from './AiModal';
import { usePostActions } from '@/hook/UsePostMutation';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useGetProfile } from '@/hook/UseProfileData';

const CreatepostMobile = ({postData}) => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imagesToDelete, setImagesToDelete] = useState([]);
  // جلب البيانات
  const { data: profileData, isLoading } = useGetProfile('me');
  const post = CreatepostLogic();
  const { updateMutation } = usePostActions();
  const [postImages, setPostImages] = useState([]); // لتخزين مصفوفة الصور
   const [codeSnippet, setCodeSnippet] = useState('');
  // جلب المنشور المطلوب من مصفوفة النتائج
  useEffect(() => {
    const posts = profileData?.results||  profileData?.posts || [];
    const foundPost = posts.find(p => p.id.toString() === id);
    
    if (foundPost) {
        setContent(foundPost.content);
        setCodeSnippet(foundPost.code || "");
        
        // التأكد من أن المصفوفة تحتوي على الصور بالروابط الكاملة
          if (foundPost.media && postImages.length === 0) {
            setPostImages(foundPost.media);
        }
    }
    // 3. إضافة الاعتماديات الصحيحة
}, [profileData, id]); 

 // أضفنا post للمراقبة

  if (isLoading) return <div className="text-center mt-20 text-2xl">Loading...</div>;

const handleSaveUpdate = () => {
    if (!id) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('code', codeSnippet || "");
    formData.append('code_language', "javascript");
    imagesToDelete.forEach(imageId => {
        formData.append('delete_images', imageId);
    });
     try {
        // نستخدم mutateAsync لضمان انتظار انتهاء العملية بنجاح
        updateMutation.mutateAsync({ 
            postId: id, 
            data: formData 
        });
        
        // الانتقال بعد نجاح العملية تماماً
        navigate('/profile/me');
    } catch (error) {
        console.error("Error updating post:", error);
    }
};
const handleDeleteClick = (imgId, index) => {
    setImagesToDelete(prev => [...prev, imgId]); // إضافة المعرف لقائمة الحذف
    setPostImages(prev => prev.filter((_, i) => i !== index)); // إخفاؤها من الواجهة
};
  return (
    
    <div className='flex-col mt-14   space-y-16'>
    <div> <p className='text-5xl flex justify-center items-center font-semibold'>{t('edit_post')}</p></div>
    <div className='flex flex-col w-full max-w-[700px] mx-auto bg-white dark:bg-dark-bg p-2 rounded-lg'>
    
    {/* حقل النص: شفاف، خط كبير، بدون حدود تركيز */}
    <div className='w-full'>
        <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder=''
            className='w-full h-auto text-[20px] border-none focus-visible:ring-0 resize-none bg-transparent dark:text-white placeholder:text-gray-500'
        />
    </div>

    {/* عرض الكود إن وجد (بتصميم أنيق) */}
    {codeSnippet && (
        <div className='my-3 rounded-md overflow-hidden border border-gray-700'>
            <div className='bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between'>
                <span>Code snippet</span>
            </div>
            <Textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className='w-full h-[250px] font-mono bg-[#1c1e21] text-pink-400 border-none focus-visible:ring-0 text-sm'
            />
        </div>
    )}

    {/* شبكة الصور: توزيع تلقائي مثل الفيس */}
    {postImages.length > 0 && (
        <div className={`grid gap-1 mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 
            ${postImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            
            {postImages.map((img, index) => (
           <div key={img.id || index} className="relative w-full">
           <img 
               // إذا كان الرابط لا يبدأ بـ http، أضيفي رابط السيرفر يدوياً
            src={img.image_url?.startsWith('http') 
                               ? img.image_url 
                               :` https://devconnect-vbiy.onrender.com${img.image_url}`} 
            className="w-full h-full object-cover rounded-md" 
            alt="post content"
            onError={(e) => { e.target.src = "/fallback-image.png"; }} // صورة بديلة في حال الخطأ
        />
        <button 
            type="button"
             onClick={async () => {
                // 1. استدعاء الأي بي آي لحذف الصورة من قاعدة البيانات فوراً
                try {
                    const formData = new FormData();
                    formData.append('delete_images', img.id); // بناءً على صورة Postman المرفقة
                    
                    await updateMutation.mutateAsync({ 
                        postId: id, 
                        data: formData 
                    });

                    // 2. تحديث الواجهة لحذف الصورة من العرض
                    setPostImages(prev => prev.filter((_, i) => i !== index));
                } catch (error) {
                    console.error("Failed to delete image");
                }
            }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-1.5 shadow-md"
        >
            <FaRegTrashAlt size={16} className="text-red-500" />
        </button>
    </div>
))}
        </div>
    )}
</div>
    
 <div className="pt-0 mb-10 pb-32 flex  items-center justify-center gap-4">
  <button  onClick={handleSaveUpdate} disabled={updateMutation.isPending}
   className="rounded-md  px-6 py-2 text-[20px] text-white bg-blue-button text-text-button">
    {t('post')}
  </button>
  <button  onClick={() => navigate(-1)}
   className="rounded-md  px-6 py-2 text-[20px] bg-cancel-button text-text-button">
    {t('cancel')}
  </button>
  <div className="relative inline-block">
    <Button className="text-[22px] border-2 rounded-[50px]  pt-1 pb-1 text-black border-black  " 
    onClick={()=>post.setshow(!post.show)}>{t('ai')}<BsStars className='size-[22px] text-amber-300'/>
    </Button>
   <AnimatePresence>
                        {post.show && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className='absolute md:left-1/5 md:-translate-x-1/2 top-full mt-3 z-[999] min-w-[280px] pb-2 left-1/6 -translate-x-1/2 '
                            >
                                <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                                    <AIAssistant
                                        type='mobile'
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
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AiModal 
                open={post.showModel}
                result={post.aiResult}
                onuse={post.handleUseAi}
                onclose={() => post.setshowModel(false)} 
            />
        </div>
    );
};

export default CreatepostMobile;