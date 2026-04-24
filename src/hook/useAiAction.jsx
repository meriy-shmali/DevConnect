import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useAiAction=({
    improveMutation,
  generateMutation,
  summarizeMutation,
  addtagMutation,
  categoryMutation,
  setText,
  setaiResult, // تعديل الاسم ليطابق
  setaiType,   // تعديل الاسم ليطابق
  setshowModel,
  parsedcontent,
})=>{
  const {t,i18n}=useTranslation();
   //دالة لتقليل تكرار الكود
  const handleModalresult=(type,result)=>{
    setaiResult(result);
   setaiType(type);
    setshowModel (true);
  }
    return{
           improve: () => { //التاكد من وجود نص قبل الارسال وعدم ارسال null
            if(!parsedcontent.text) return;
            const toastId=toast.loading(t('improve_loading'))
           
      improveMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => {
     const result = res.data.improved_text
      if (result) {
        handleModalresult("improve", result);
      } else {
        console.log("الباك إند أرجع بيانات فارغة أو مسمى حقل مختلف:", res.data);
      }
    
        },
         onError: (res) => {
      toast.error(t('improve_error'), { id: toastId });
      console.log("الباك إند أرجع بيانات فارغة أو مسمى حقل مختلف:", res.data);
    },
      });
    },

    generate: () => {
      if (!parsedcontent.text) return;
       const toastId=toast.loading(t('generate_loading'))
      generateMutation.mutate(parsedcontent.text, {
        onSuccess: (res) =>{
          const generatedText =  res.data.enhanced_post;
          toast.success(t('generate_success'), { id: toastId })
     setText(generatedText + (parsedcontent.code ? "\n\n" + parsedcontent.code : ""));},
           onError: () => {
      toast.error(t('generate_error'), { id: toastId });
      }});
    },

    summarize: () => {
       if(!parsedcontent.code) return;
        const toastId=toast.loading(t('summarize_loading'))
        const currentAppLang = i18n.language === 'ar' ? 'ar' : 'en';
      summarizeMutation.mutate({
  code: parsedcontent.code, 
  appLanguage: currentAppLang
    
}, {
        onSuccess: (res) => {
          toast.success(t('summarize_success'), { id: toastId })
          handleModalresult("summarize",res.data.explanation)
        },
        onError: (err) => {
      toast.error(t('summarize_error'), { id: toastId });
      console.log("تفاصيل خطأ 400:", err.response?.data);
      }
      });
    },
// اضافة ؟ على التاغات لان الباك قد يرسل التاغ فارغ فهذا الشي لمنع حدوث خطأ
    addTags: (text) => {
      const toastId=toast.loading(t('tags_loading'))
      addtagMutation.mutate(text, {
        onSuccess: (res) => {
          toast.success(t('tags_success'), { id: toastId })
          setText((prev) => prev + "\n\n " + res.data.tags?.map(t => `#${t}`).join(" ")||"");
        }, onError: () => {
      toast.error(t('tags_error'), { id: toastId });
      }
      });
    },

    categorize: (text) => {
      const toastId=toast.loading(t('classify_loading'))
      categoryMutation.mutate({content: text}, {
        onSuccess: (res) => {
          toast.success(t('classify_success'), { id: toastId })
          setText((prev) => prev + `\n\ncategory: ${res.data.post_type}`||"");
        },
        onError: () => {
      toast.error(t('classify_error'), { id: toastId });
      }
      });
    },
  };
};
    
