import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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

  // --- 1. تعريف الدوال كمتغيرات مستقلة أولاً ---

  const improve = () => {
    if (!parsedcontent.text) return;
    const toastId = toast.loading(t('improve_loading'));
    improveMutation.mutate(parsedcontent.text, {
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

  const generate = () => {
    if (!parsedcontent.text) return;
    const toastId = toast.loading(t('generate_loading'));
    generateMutation.mutate(parsedcontent.text, {
      onSuccess: (res) => {
        const generatedText = res.data.enhanced_post;
        if (generatedText) {
          toast.success(t('generate_success'), { id: toastId });
          handleModalresult("generate", generatedText);
        }
      },
      onError: () => toast.error(t('generate_error'), { id: toastId })
    });
  };

  const summarize = () => {
    if (!parsedcontent.code) return;
    const toastId = toast.loading(t('summarize_loading'));
    const currentAppLang = i18n.language === 'ar' ? 'ar' : 'en';
    summarizeMutation.mutate({
      code: parsedcontent.code,
      appLanguage: currentAppLang
    }, {
      onSuccess: (res) => {
        const result = res.data.explanation;
        if (result) {
          toast.success(t('summarize_success'), { id: toastId });
          handleModalresult("summarize", result);
        }
      },
      onError: () => toast.error(t('summarize_error'), { id: toastId })
    });
  };

 const addTags = (text) => {
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
};

  const categorize = (text) => {
    if (!text) return;
    const toastId = toast.loading(t('classify_loading'));
    const currentAppLang = i18n.language === 'ar' ? 'ar' : 'en';
    categoryMutation.mutate({ content: text, language: currentAppLang }, {
      onSuccess: (res) => {
        toast.success(t('classify_success'), { id: toastId });
        setCategory(res.data.post_type);
        setDisplayCategory(res.data.post_type);
      },
      onError: () => toast.error(t('classify_error'), { id: toastId })
    });
  };

  // --- 2. إرجاع الدوال في كائن الـ return ---
  return {
    improve,
    generate,
    summarize,
    addTags,
    categorize,
    regenerate: (type) => {
      // هنا نستدعي الدوال مباشرة بدون كلمة "actions"
      if (type === "improve") improve();
      else if (type === "generate") generate();
      else if (type === "summarize") summarize();
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