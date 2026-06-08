import CreatepostLogic from '@/hook/CreatepostLogic';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import Buttons from '../ui/ButtonGroup';
import { BsStars } from 'react-icons/bs';
import { motion, AnimatePresence } from "framer-motion";
import AIAssistant from '../Feed/AIAssistant';
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import AiModal from '@/components/Feed/AiModal';
import { usePostActions } from '@/hook/UsePostMutation';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useGetProfile } from '@/hook/UseProfileData';
import Header from './Header';

const CreatepostMobile = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const { data: profileData, isLoading } = useGetProfile('me');
  const post = CreatepostLogic();
  const { updateMutation } = usePostActions();
  const [postImages, setPostImages] = useState([]); 
  const [codeSnippet, setCodeSnippet] = useState('');
  
  const aiMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (post.show && aiMenuRef.current && !aiMenuRef.current.contains(event.target)) {
        post.setshow(false);
      }
    };
    if (post.show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [post.show]);

  useEffect(() => {
    const posts = profileData?.results || profileData?.posts || [];
    const foundPost = posts.find(p => p.id.toString() === id);
    
    if (foundPost) {
        setContent(foundPost.content);
        setCodeSnippet(foundPost.code || "");
        if (foundPost.media && postImages.length === 0) {
          setPostImages(foundPost.media);
        }
    }
  }, [profileData, id]); 

  if (isLoading) return <div className="text-center mt-20 text-2xl">{t('is_loading')}</div>;

  const handleSaveUpdate = async () => {
    if (!id) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('code', codeSnippet || "");
    formData.append('code_language', "javascript");
    imagesToDelete.forEach(imageId => {
        formData.append('delete_images', imageId);
    });

    try {
        // ✅ ننتظر الـ mutation تنتهي قبل الانتقال
        await updateMutation.mutateAsync({ 
            postId: id, 
            data: formData 
        });
        // الانتقال يصير بعد نجاح الـ mutation فقط
        navigate('/profile/me');
    } catch (error) {
        console.error("Error updating post:", error);
        // لا ننتقل في حالة الخطأ
    }
  };

  return (
    <div className="w-full h-full">
      <div className='flex-col md:mt-20 mt-20 space-y-16'>
        <div> 
          <p className='md:text-5xl text-4xl font-title flex justify-center items-center font-semibold dark:text-gray-50'>
            {t('edit_post')}
          </p>
        </div>
        
        <div className='flex flex-col w-full max-w-[700px] mx-auto '>
          <div className='md:w-full ms-14 md:ms-0 w-[300px] m-2 shadow rounded-lg bg-white border border-gray-100'>
              <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder=''
                  className='md:w-full h-fit md:text-lg text-md border-none focus-visible:ring-0 bg-transparent placeholder:text-gray-500 dark:text-gray-50 dark:bg-dark-post-background'
              />
          </div>

          {codeSnippet && (
              <div className='my-3 md:w-full w-[300px] ms-14 md:ms-0   rounded-md overflow-hidden border border-gray-700'>
                  <Textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      className='md:w-full  h-[250px] font-mono bg-[#1c1e21] text-pink-400 border-none resize focus-visible:ring-0 text-sm dark:text-gray-50 dark:bg-dark-post-background'
                  />
              </div>
          )}

          {postImages.length > 0 && (
              <div className={`grid gap-1 mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 
                  ${postImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  
                  {postImages.map((img, index) => (
                    <div key={img.id || index} className="relative w-full">
                      <img 
                        src={img.image_url?.startsWith('http') 
                                    ? img.image_url 
                                    : `https://devconnect-vbiy.onrender.com${img.image_url}`} 
                        className="w-full h-full object-cover rounded-md" 
                        alt="post content"
                        onError={(e) => { e.target.src = "/fallback-image.png"; }}
                      />
                      <button 
                          type="button"
                          onClick={async () => {
                              try {
                                  const formData = new FormData();
                                  formData.append('delete_images', img.id);
                                  await updateMutation.mutateAsync({ 
                                      postId: id, 
                                      data: formData 
                                  });
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
        
        <div className="pt-0 mb-10 pb-32 flex items-center justify-center gap-4">
          {/* ✅ زر النشر - disabled أثناء التحميل مع مؤشر واضح */}
          <button 
            onClick={handleSaveUpdate} 
            disabled={updateMutation.isPending}
            className="rounded-md px-5 py-2 md:text-[18px] text-white bg-blue-button hover:bg-hover-blue text-text-button disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? t('saving') || '...' : t('post')}
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            disabled={updateMutation.isPending}
            className="rounded-md px-5 py-2 md:text-[18px] bg-cancel-button hover:bg-[#b53e5d] text-text-button disabled:opacity-60"
          >
            {t('cancel')}
          </button>

          <div ref={aiMenuRef} className="relative inline-block">
            <Button className="text-[18px] border-2 rounded-[50px] pt-1 pb-1 text-black border-black dark:bg-dark-post-background dark:text-gray-50" 
              onClick={() => post.setshow(!post.show)}>
              {t('ai')}<BsStars className='size-[22px] text-amber-300'/>
            </Button>
            
            <AnimatePresence>
              {post.show && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute md:left-1/2 md:-translate-x-1/2 top-full mt-3 z-[999] w-[222px] xs:w-[260px] pb-2 left-1/6 -translate-x-1/2'
                >
                    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                        <AIAssistant
                            type='edit'
                            improve={() => post.aiaction.improve(content)}
                            generate={() => post.aiaction.generate(content)}
                            summarize={() => post.aiaction.summarize(codeSnippet)}
                            improveM={post.improveMutation}
                            generateM={post.generateMutation}
                            summarizeM={post.summarizeMutation}
                        />
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AiModal 
          open={post.showModel}
          result={post.aiResult}
          onuse={() => {
            if (post.aiType === "generate" || post.aiType === "improve") {
              setContent(post.aiResult);
            } else if (post.aiType === "summarize") {
              setContent(prev => prev + "\n\n" + post.aiResult);
            } else {
              setCodeSnippet(post.aiResult);
            }
            post.setshowModel(false);
          }}
          onclose={() => post.setshowModel(false)}
          showTranslate={post.aiType === "summarize"}
          onTranslate={() => post.aiaction.toggleTranslation(codeSnippet)}
          onRegenerate={() => post.aiaction.regenerate(post.aiType, post.aiType === "summarize" ? codeSnippet : content)}
          isPending={
            post.improveMutation.isPending ||
            post.generateMutation.isPending ||
            post.summarizeMutation.isPending
          }
          hideActionButtons={false}
      />
    </div>
  );
};

export default CreatepostMobile;