import { useState, useEffect } from "react";
import { usecommentreaction, useDeletecomment, usetranslatecomment,useEditcomment, useaddreply } from "@/hook/UseMutationComment";
import { usegetreplies } from "@/hook/UseQueryComment";
import { staticReplies } from "@/Utils/data/staticReplies";
import { useAuth } from "@/context/AuthContext";
import {useQueryClient } from "@tanstack/react-query";
import { UseMe } from "./UseQueryMe";
export const useCommentLogic = (items = [],postId) => {
  const [activeCommentId, setActiveCommentId] = useState(null);//لمعرفة الردود تابعة لاي تعليق
  const [showmenu, setshowmenu] = useState(false);
  const[countreply,setcountreply]=useState({})
  const [menu, setMenu] = useState({});//عندي مجموعة تعليقات وكل تعليق له حالة
  const [translate, settranslate] = useState({});//الترجمة
  const [istranslate, setistranslate] = useState({});//هل عم نعرض النص المترجم ام الاصلي
  const [viewreply, setviewreply] = useState({});
  const [replyInput, setReplyInput] = useState({});//لفتح حقل الادخال
  const [replydata, setreplydata] = useState({});//لتخزين الردود
  const [replyText, setreplyText] = useState({});//لادخال النص 
  const [editing, setEditing] = useState({});//من اجل تعديل التعليق
  const { data: currentUser } = UseMe();
  const editComment=useEditcomment();
  const commentreactionMutation = usecommentreaction();
  const TranslatecommentMutaion = usetranslatecomment();
  const deletecomment = useDeletecomment();
  const addreplyMutation = useaddreply()
  const  queryClient=useQueryClient()
const { data: fetchedReplies = [] } = usegetreplies(activeCommentId, !!activeCommentId);
useEffect(() => {
  if (items && items.length > 0) {
    const initialCounts = {};
    items.forEach(c => {
      initialCounts[c.id] = c.replies_count || 0;
    });
    setcountreply(prev => ({ ...initialCounts, ...prev }));
  }
}, [items]);
  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id] //بحافظ على القيم القديمة وبعكس القيمة الجديدة 
  }));
};
const [counts, setCounts] = useState({});
const [active, setActive] = useState({});
useEffect(() => {
  if (items && items.length > 0) {
    const newCounts = {};
    const newActive = {};
    
    items.forEach(c => {
      // نستخدم useful و not_useful لتطابق الـ ReactionPanel
      newCounts[c.id] = { 
        useful: c.likes || 0, 
        not_useful: c.dislikes || 0 
      };
      newActive[c.id] = c.userReaction || null;
    });

    setCounts(prev => ({ ...newCounts, ...prev }));
    setActive(prev => ({ ...newActive, ...prev }));
  }
}, [items]);
  // Fetch replies when activeCommentId changes
useEffect(() => {
  if (activeCommentId && fetchedReplies) {
    setreplydata(prev => ({
      ...prev,
      [activeCommentId]: fetchedReplies
    }));
  }
}, [fetchedReplies, activeCommentId]);
  // Toggle reply input
 const handleReplyClick = (comment) => {
  const id = comment.id;
  const isInputOpen = replyInput[id];
  const isRepliesOpen = viewreply[id];
  const isFullyOpen = isInputOpen && isRepliesOpen;
  if (isFullyOpen) {
    // سكّر الكل
    setReplyInput(prev => ({ ...prev, [id]: false }));
    setviewreply(prev => ({ ...prev, [id]: false }));
  } else {
    // افتح الكل
    setReplyInput(prev => ({ ...prev, [id]: true }));
    setviewreply(prev => ({ ...prev, [id]: true }));
    if (!replyText[id]) {
      setreplyText(prev => ({
        ...prev,
        [id]: `@${comment.user_username|| ""} `
      }));
    }
    setActiveCommentId(id);
  }
};
  // Toggle view replies
const handleViewreply = (commentId) => {
 const isInputOpen = replyInput[commentId];

  if (isInputOpen) {
    setReplyInput(prev => ({
      ...prev,
      [commentId]: false
    }));

    setviewreply(prev => ({
      ...prev,
      [commentId]: true
    }));

  } else { 
    setviewreply(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }

  setActiveCommentId(commentId);
  queryClient.invalidateQueries({ queryKey:["replies", commentId]})
};
const handlesendreply = (parentId) => {
  const text = replyText[parentId];
  if (!text?.trim()) return;
  //edit
  if (editing[parentId]) {
    setreplydata(prev => {
      const updated = { ...prev };

      Object.keys(updated).forEach(key => {
        updated[key] = updated[key].map(c =>
          c.id === parentId ? { ...c, content: text} : c
        );
      });

      return updated;
    });

    setEditing(prev => ({ ...prev, [parentId]: false }));
    setReplyInput(prev => ({ ...prev, [parentId]: false }));
    setreplyText(prev => ({ ...prev, [parentId]: "" }));

  editComment.mutate({ commentId: parentId,
    content: text }, {
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey:["comment", postId]}
      );
  }
}); //  الصح

    return;
  }

  //  reply عادي


 
  setreplyText(prev => ({ ...prev, [parentId]: "" }));

addreplyMutation.mutate(
  {
    postId,
    content: text,
    parent: parentId
  },
  {
    onSuccess: (res) => {
      const serverReply = res.data;

      setreplydata(prev => ({
        ...prev,
        [parentId]: [
          ...(prev[parentId] || []),
          serverReply   // ✔️ هيك الصح
        ]
      }));
 setcountreply(prev => ({
    ...prev,
    [parentId]: (Number(prev[parentId]) || 0) + 1 
  }));
      setReplyInput(prev => ({ ...prev, [parentId]: false }));
      setreplyText(prev => ({ ...prev, [parentId]: "" }));
    }
  }
);
};
  const handleReaction = (commentId, type) => {
   const current = active[commentId]; // like | dislike | null

  let reaction_type = type;

  // إذا ضغط نفس الزر → إلغاء التفاعل
  if (current === type) {
    reaction_type = null;
  }

  // تحديث UI فوراً
  setActive(prev => ({
    ...prev,
    [commentId]: reaction_type
  }));

  setCounts(prev => {
    const prevCounts = prev[commentId] || { useful: 0, not_useful: 0 };

    let useful = prevCounts.useful;
    let not_useful = prevCounts.not_useful;

    // إزالة التفاعل السابق
    if (current === "useful") useful--;
    if (current === "not_useful") not_useful--;

    // إضافة التفاعل الجديد
    if (reaction_type === "useful") useful++;
    if (reaction_type === "not_useful") not_useful++;

    return {
      ...prev,
      [commentId]: {
        useful,
        not_useful
      }
    };
  });
  commentreactionMutation.mutate(
    {
      commentId,
      reaction_type
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ["comment", postId]
        });
      }
    }
  );
  };
  const handleTranslate = (comment) => {
  const id = comment.id;

  if (istranslate[id]) {
    return setistranslate(prev => ({
      ...prev,
      [id]: false
    }));
  }
  // إذا موجود ترجمة مسبقاً بس رجّعها
  if (translate[id]) {
    return setistranslate(prev => ({
      ...prev,
      [id]: true
    }));
  }
  TranslatecommentMutaion.mutate(
    { commentId: id },
    {
      onSuccess: (res) => {
        settranslate(prev => ({
          ...prev,
          [id]: res.data.comment // 👈 هذا المهم
        }));
        setistranslate(prev => ({
          ...prev,
          [id]: true
        }));
      }
    }
  );
  };
  const handleDeleteComment = (commentId) => {
  setreplydata(prev => {
    const newData = { ...prev };
    Object.keys(newData).forEach(parentId => {
      newData[parentId] = newData[parentId].filter(c => c.id !== commentId);
    });
    return newData;
  });

deletecomment.mutate(commentId, {
  onSuccess: (res) => {
    setreplydata(prev => {
      const newData = { ...prev };

      Object.keys(newData).forEach(parentId => {
        newData[parentId] = newData[parentId].filter(
          c => c.id !== commentId
        );
      });

      return newData;
    });

    setCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[commentId];
      return newCounts;
    });

    queryClient.invalidateQueries({
      queryKey: ["comment", postId]
    });
  }
})
};
const handleEditClick = (comment) => {
  const id = comment.id;
  // افتح input
  setReplyInput(prev => ({
    ...prev,
    [id]: true
  }));
  // فعل وضع التعديل
  setEditing(prev => ({
    ...prev,
    [id]: true
  }));
  // حط النص الحالي
  setreplyText(prev => ({
    ...prev,
    [id]: comment.content
  }));
   setMenu(prev => ({ ...prev, [id]: false }));
};
const resetCommentState = () => {
  setReplyInput({});
  setreplyText({});
  setviewreply({});
  setEditing({});
  setMenu({});
  setActiveCommentId(null);
};
 return {
  showmenu, setshowmenu,
  handleTranslate, istranslate, translate,
  handleReaction, counts,
  handleReplyClick, handleViewreply, handlesendreply, handleEditClick,
  viewreply, replydata, replyText, replyInput, setreplyText,
  handleDeleteComment, currentUser, editing, menu, toggleMenu,setreplydata,resetCommentState,setcountreply,countreply
};
};