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
})=>{
    return{
           improve: () => {
      improveMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => {
          setAiResult(res.data.text);
          setAiType("improve");
          setShowModal(true);
        },
      });
    },

    generate: () => {
      generateMutation.mutate(parsedcontent.text, {
        onSuccess: (res) => setText(res.data.text),
      });
    },

    summarize: () => {
      summarizeMutation.mutate(parsedcontent.code, {
        onSuccess: (res) => {
          setAiResult(res.data.text);
          setAiType("summarize");
          setShowModal(true);
        },
      });
    },

    addTags: (text) => {
      addtagMutation.mutate(text, {
        onSuccess: (res) => {
          setText((prev) => prev + "\n\n" + res.data.tags.map(t => `#${t}`).join(" "));
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
    
