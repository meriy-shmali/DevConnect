import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button"; // مسار ملف button.jsx الخاص بك
import { Textarea } from "@/components/ui/textarea"; // مسار ملف textarea.jsx الخاص بك
import { AiAction } from "@/hook/AiAction"; 
import { usePostMutation } from "@/hook/UsePostMutation";
import * as AiMutations from "@/hook/UseMutationAi";
import AiDropdown from "./AiDropdown";
import { Sparkles } from "lucide-react";
import { X, Bot } from 'lucide-react';

const EditPostModal = ({ initialText, onClose,postData }) => {
  const { t } = useTranslation();
  const { editMutation,removeMutation} = usePostMutation();
  const [text, setText] = useState(initialText || "");
  const [showAiMenu, setShowAiMenu] = useState(false);
   // دالة الحفظ (زر Post)
  const handleSave = () => {
    editMutation.mutate({
      postId: postData.id,
      content: text,
      // deleteImages: [ids...] إذا أردتِ إضافة منطق حذف الصور لاحقاً
    }, {
      onSuccess: () => onClose() // إغلاق المودال بعد النجاح
    });
  };

  // دالة الحذف الكامل (إذا أردتِ إضافة زر حذف)
  const handleDelete = () => {
    if (window.confirm("Are you sure?")) {
      removeMutation.mutate(postData.id, {
        onSuccess: () => onClose()
      });
    }
  }
  
  // تعريف الـ Mutations بناءً على UseMutationAi.jsx
  const improveMutation = AiMutations.useimprovepost();
  const generateMutation = AiMutations.usegeneratepost();
  const summarizeMutation = AiMutations.usesummarizecode();
  const addtagMutation = AiMutations.useaddtags();
  const categoryMutation = AiMutations.usecategory();

  // ربط الأفعال بملف AiAction.js
  const actions = AiAction({
    improveMutation,
    generateMutation,
    summarizeMutation,
    addtagMutation,
    categoryMutation,
    setText,
    setAiResult: (res) => setText(res), // تبسيط للنتائج المباشرة
    setAiType: () => {},
    setShowModal: () => {},
    parsedcontent: { text: text, code: text }, // نرسل النص ككود أيضاً للتبسيط
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all duration-300 cursor-pointer">
      <div className="w-full max-w-lg rounded-[30px] bg-white p-4 shadow-2xl dark:bg-dark-post-background animate-in zoom-in-95 duration-300">
        
        {/* Header */}
         <div className=" relative flex items-center shrink-0 p-3 ">
        <h2 className=" text-center text-2xl font-bold text-gray-800 dark:text-dark-text text-4xl font-medium text-gray-900  tracking-tight p-2">
          {t("edit_post")}
        </h2>
        <button onClick={onClose} className=" absolute top-5 right-5 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6  text-red-500 text-xl font-light hover:text-red-700 " />
          </button>
        </div>

        {/* Input Area */}
        <div className="relative m-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-[150px] resize-none  bg-gray-100/50 p-4 focus-visible:ring-0 dark:bg-input/20"
            
          />
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-center gap-7">
          {/* Post Button - Blue Custom */}
          <Button 
            onClick={handleSave} 
            isLoading={editMutation.isLoading}
            className="bg-blue-button text-text-button md:text-[20px] text-[20px]  md:w-[85px] w-[75px] "
            size="sm"
          >
            {t("edit")}
          </Button>

          {/* Cancel Button - Custom Destructive */}
          <Button 
            size="sm"
            onClick={onClose}
            className="bg-cancel-button text-text-button md:text-[20px] text-[20px]  md:w-[85px] w-[75px] "
          >
            {t("cancel")}
          </Button>

          {/* AI Assistant Button */}
          <div className="relative">
            <Button
              variant="ai"
              size="md"
              className="border-ai-assistant border-2  text-ai-assistant bg-white md:text-[23px] text-[20px]  md:w-[150px] w-[124px] px-2 py-2"
              onClick={() => setShowAiMenu(!showAiMenu)}
            >
              <Sparkles className="size-5 text-ai-assistant" />
              <span className="text-sm">{t("ai")}</span>
            </Button>

            {showAiMenu && (
              <AiDropdown actions={actions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;