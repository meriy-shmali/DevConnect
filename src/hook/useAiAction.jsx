import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
export const useAiAction=({
    improveMutation,
  generateMutation,
  summarizeMutation,
  addtagMutation,
  categoryMutation,
  setText,
  setAiResult,
  setAiType,
  setShowModel,
  parsedcontent,
})=>{
  const {t}=useTranslation();
   //دالة لتقليل تكرار الكود
  const handleModalresult=(type,result)=>{
    setAiResult(result);
    setAiType(type);
    setShowModel(true);
  }
    return{
           improve: () => { //التاكد من وجود نص قبل الارسال وعدم ارسال null
            if(!parsedcontent.text) return;
            const toastId=toast.loading(t('improve_loading'))
      improveMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => {
          toast.success(t('improve_success'), { id: toastId })
        handleModalresult("improve",res.data.text)
        },
         onError: () => {
      toast.error(t('improve_error'), { id: toastId });
    },
      });
    },

    generate: () => {
      if (!parsedcontent.text) return;
       const toastId=toast.loading(t('generate_loading'))
      generateMutation.mutate(parsedcontent.text, {
        onSuccess: (res) =>{
          toast.success(t('generate_success'), { id: toastId })
           setText(res.data.text)},
           onError: () => {
      toast.error(t('generate_error'), { id: toastId });
      }});
    },

    summarize: () => {
       if(!parsedcontent.code) return;
        const toastId=toast.loading(t('summarize_loading'))
      summarizeMutation.mutate({
  code: parsedcontent.code,
  code_Language: parsedcontent.language
}, {
        onSuccess: (res) => {
          toast.success(t('summarize_success'), { id: toastId })
          handleModalresult("summarize",res.data.text)
        },
        onError: () => {
      toast.error(t('summarize_error'), { id: toastId });
      }
      });
    },
// اضافة ؟ على التاغات لان الباك قد يرسل التاغ فارغ فهذا الشي لمنع حدوث خطأ
    addTags: (text) => {
      const toastId=toast.loading(t('tags_loading'))
      addtagMutation.mutate(text, {
        onSuccess: (res) => {
          toast.success(t('tags_success'), { id: toastId })
          setText((prev) => prev + "\n\n" + res.data.tags?.map(t => `#${t}`).join(" ")||"");
        }, onError: () => {
      toast.error(t('tags_error'), { id: toastId });
      }
      });
    },

    categorize: (text) => {
      const toastId=toast.loading(t('classify_loading'))
      categoryMutation.mutate(text, {
        onSuccess: (res) => {
          toast.success(t('classify_success'), { id: toastId })
          setText((prev) => prev + `\n\ncategory: ${res.data.category}`||"");
        },
        onError: () => {
      toast.error(t('classify_error'), { id: toastId });
      }
      });
    },
  };
};
    
