export const AiAction=({
    improveMutation,
  generateMutation,
  summarizeMutation,
  addtagMutation,
  categoryMutation,
  setText,
  setAiResult,
  setAiType,
  setShowModal,
  parsedcontent,
})=>{ //دالة لتقليل تكرار الكود
  const handleModalresult=(type,result)=>{
    setAiResult(result);
    setAiType(type);
    setShowModal(true);
  }
    return{
           improve: () => { //التاكد من وجود نص قبل الارسال وعدم ارسال null
            if(!parsedcontent.text) return;
      improveMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => {
        handleModalresult("improve",res.data.text)
        },
      });
    },

    generate: () => {
      generateMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => setText(res.data.text),
      });
    },

    summarize: () => {
       if(!parsedcontent.code) return;
      summarizeMutation.mutate(parsedcontent.code, {
        onSuccess: (res) => {
          handleModalresult("summarize",res.data.text)
        },
      });
    },
// اضافة ؟ على التاغات لان الباك قد يرسل التاغ فارغ فهذا الشي لمنع حدوث خطأ
    addTags: (text) => {
      addtagMutation.mutate(text, {
        onSuccess: (res) => {
          setText((prev) => prev + "\n\n" + res.data.tags?.map(t => `#${t}`).join(" "));
        },
      });
    },

    categorize: (text) => {
      categoryMutation.mutate(text, {
        onSuccess: (res) => {
          setText((prev) => prev + `\n\ncategory: ${res.data.category}`);
        },
      });
    },
  };
};
    
