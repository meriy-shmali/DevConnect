import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const useAiAction = ({
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
  setCategory,
  setDisplayCategory,
  setTag
}) => {
  const { t, i18n } = useTranslation();
  // عملنا state بحتى نتبع اللغة
  const [summaryLang, setSummaryLang] = useState(i18n.language === 'ar' ? 'ar' : 'en');

  // دالة المساعدة لتحديث المودال
  const handleModalresult = (type, result) => {
    setshowModel(false);
    setaiResult("");
    setTimeout(() => {
      setaiType(type);
      setaiResult(result);
      setshowModel(true);
    }, 10);
  };

  // 🌟 تعديل: أصبحت تستقبل نصاً خارجياً اختصارياً
  const improve = (textParam) => {
    const textToSend = textParam || parsedcontent?.text;
    if (!textToSend) return;

    const toastId = toast.loading(t('improve_loading'));
    improveMutation.mutate(textToSend, {
      onSuccess: (res) => {
        const result = res.data.improved_text;
        if (result) {
          toast.success(t('improve_success'), { id: toastId });
          handleModalresult("improve", result);
        }
      },
      onError: () => toast.error(t('improve_error'), { id: toastId }),
    });
  };

  // 🌟 تعديل: أصبحت تستقبل نصاً خارجياً اختصارياً
  const generate = (textParam) => {
    const textToSend = textParam || parsedcontent?.text;
    if (!textToSend) return;

    const toastId = toast.loading(t('generate_loading'));
    generateMutation.mutate(textToSend, {
      onSuccess: (res) => {
        const generatedText = res.data.enhanced_post || res.data.generated_text; // دعم الاسمين للاحتياط
        if (generatedText) {
          toast.success(t('generate_success'), { id: toastId });
          handleModalresult("generate", generatedText);
        }
      },
      onError: () => toast.error(t('generate_error'), { id: toastId })
    });
  };

  // 🌟 تعديل: أصبحت تستقبل اللغة ونص الكود الخارجي بشكل اختياري
  const summarize = (forcedLang, codeParam) => {
    const codeToSend = codeParam || parsedcontent?.code;
    if (!codeToSend) return;

    const toastId = toast.loading(t('summarize_loading'));
    const targetLang = forcedLang || (i18n.language === 'ar' ? 'ar' : 'en');
    
    summarizeMutation.mutate({
      code: codeToSend,
      appLanguage: targetLang
    }, {
      onSuccess: (res) => {
        const result = res.data.explanation;
        if (result) {
          toast.success(t('summarize_success'), { id: toastId });
          handleModalresult("summarize", result);
          setSummaryLang(targetLang); // منحفظ اللغة يلي جاوبنا فيها
        }
      },
      onError: () => toast.error(t('summarize_error'), { id: toastId })
    });
  };

  // 🌟 تعديل: أصبحت تستقبل نصاً خارجياً اختصارياً
  const addTags = (textParam) => {
    const textToSend = textParam || parsedcontent?.text;
    if (!textToSend) return;

    const toastId = toast.loading(t('tags_loading'));
    addtagMutation.mutate(textToSend, {
      onSuccess: (res) => {
        toast.success(t('tags_success'), { id: toastId });
        
        const newTagsArray = res.data.tags || [];
        const tagsWithHashtags = newTagsArray
          .map(tag => `#${tag.trim()}`)
          .join(" ");
        
        // تحديث الـ textarea بالفورم الأساسي أو وضعها بالنتيجة حسب شاشتك
        setText(prev => prev.trim() + "\n\n" + tagsWithHashtags);
        setTag(prev => [...new Set([...prev, ...newTagsArray])]);
      },
      onError: () => {
        toast.error(t('tags_error'), { id: toastId });
      }
    });
  };

  // 🌟 تعديل: أصبحت تستقبل نصاً خارجياً اختصارياً
  const categorize = (textParam) => {
    const textToSend = textParam || parsedcontent?.text;
    if (!textToSend) return;

    const toastId = toast.loading(t('classify_loading'));
    const currentAppLang = i18n.language === 'ar' ? 'ar' : 'en';
    categoryMutation.mutate({ content: textToSend, language: currentAppLang }, {
      onSuccess: (res) => {
        toast.success(t('classify_success'), { id: toastId });
        setCategory(res.data.post_type);
        setDisplayCategory(res.data.post_type);
      },
      onError: () => toast.error(t('classify_error'), { id: toastId })
    });
  };

  // 🌟 تعديل: تمرير النص عند تبديل لغة التلخيص
  const toggleTranslation = (codeParam) => {
    const nextLang = summaryLang === 'ar' ? 'en' : 'ar';
    summarize(nextLang, codeParam); 
  };

  // --- 2. إرجاع الدوال في كائن الـ return مع جعلها تستقبل البارامترات الممررة ---
  return {
    improve: (textParam) => improve(textParam),
    generate: (textParam) => generate(textParam),
    summarize: (codeParam) => summarize(i18n.language === 'ar' ? 'ar' : 'en', codeParam),
    addTags: (textParam) => addTags(textParam),
    categorize: (textParam) => categorize(textParam),
    toggleTranslation: (codeParam) => toggleTranslation(codeParam),
    regenerate: (type, textOrCodeParam) => {
      if (type === "improve") improve(textOrCodeParam);
      else if (type === "generate") generate(textOrCodeParam);
      else if (type === "summarize") summarize(summaryLang, textOrCodeParam);
    }
  };
};
/*addTags: (text) => {
  const toastId = toast.loading(t('tags_loading'))
  addtagMutation.mutate(text, {
    onSuccess: (res) => {
      toast.success(t('tags_success'), { id: toastId })
      
      const newTagsArray = res.data.tags || [];

      // --- الإصلاح هنا ---
      // نقوم بإضافة # لكل تاغ بشكل فردي أولاً، ثم ندمجهم بمسافات
      const tagsWithHashtags = newTagsArray
        .map(tag => `#${tag.trim()}`) // تضمن أن كل تاغ يبدأ بـ #
        .join(" "); // تدمجهم ليصبحوا: #Django #Python #serializers
      
      // تحديث الـ textarea
      setText(prev => prev.trim() + "\n\n" + tagsWithHashtags);
      
      // تحديث الحالة البرمجية (المصفوفة تبقى بدون هاشتاجات للباك-إند)
      setTag(prev => [...new Set([...prev, ...newTagsArray])]);
    },
    onError: () => {
      toast.error(t('tags_error'), { id: toastId });
    }
  });
}, */