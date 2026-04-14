import { useState, useEffect } from "react";
import { usecommentreaction, useDeletecomment, usereplycomment, usetranslatecomment,useEditcomment } from "@/hook/UseMutationComment";
import { usegetreplies } from "@/hook/UseQueryComment";
import { staticReplies } from "@/Utils/data/staticReplies";
import { useAuth } from "@/context/AuthContext";
import {useQueryClient } from "@tanstack/react-query";
export const useCommentLogic = (items = [],postId) => {
  const [activeCommentId, setActiveCommentId] = useState(null);//لمعرفة الردود تابعة لاي تعليق
  const [showmenu, setshowmenu] = useState(false);
  const [menu, setMenu] = useState({});//عندي مجموعة تعليقات وكل تعليق له حالة
  const [translate, settranslate] = useState({});//الترجمة
  const [istranslate, setistranslate] = useState({});//هل عم نعرض النص المترجم ام الاصلي
  const [viewreply, setviewreply] = useState({});
  const [replyInput, setReplyInput] = useState({});//لفتح حقل الادخال
  const [replydata, setreplydata] = useState({});//لتخزين الردود
  const [replyText, setreplyText] = useState({});//لادخال النص 
  const [editing, setEditing] = useState({});//من اجل تعديل التعليق
  const { currentUser } = useAuth();
  const editComment=useEditcomment();
  const commentreactionMutation = usecommentreaction();
  const TranslatecommentMutaion = usetranslatecomment();
  const deletecomment = useDeletecomment();
  const addreplyMutation = usereplycomment();
  const  queryClient=useQueryClient()
  const { data: fetchedReplies } = usegetreplies(activeCommentId, !!activeCommentId);
  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id] //بحافظ على القيم القديمة وبعكس القيمة الجديدة 
  }));
};
  const [counts, setCounts] = useState(() => {
    const map = {};
    [...items, ...Object.values(replydata).flat()].forEach(c => {
      map[c.id] = { likes: c.likes || 0, dislikes: c.dislikes || 0 };
    });
    return map;
  });//يتم تنفيذها مرة واحدة من اجل الكومينت والريبلاي 
  const [active, setActive] = useState(() => {
    const map = {};
    items.forEach(c => map[c.id] = c.userReaction || null);
    return map;
  });//user reaction بكون حسب الباك 

  // Fetch replies when activeCommentId changes
  useEffect(() => {
    if (!activeCommentId) return;
    const replies = fetchedReplies?.length > 0
      ? fetchedReplies
      : staticReplies[activeCommentId] || [];
    setreplydata(prev => ({
      ...prev,
      [activeCommentId]: replies//الردود الخاصة بتعليق معين 
    }));
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
        [id]: `@${comment.user?.username || ""} `
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
          c.id === parentId ? { ...c, text } : c
        );
      });

      return updated;
    });

    setEditing(prev => ({ ...prev, [parentId]: false }));
    setReplyInput(prev => ({ ...prev, [parentId]: false }));
    setreplyText(prev => ({ ...prev, [parentId]: "" }));

  editComment.mutate({ commentId: parentId, text }, {
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey:["comment", postId]}
      );
  }
}); //  الصح

    return;
  }

  //  reply عادي
  const newReply = {
    id: Date.now(),
    text,
    user: { username: "You", personal_photo_url: "/images/default-avatar.jpg" },
    createdAt: "now"
  };

  setreplydata(prev => ({
    ...prev,
    [parentId]: [...(prev[parentId] || []), newReply]
  }));

  setreplyText(prev => ({ ...prev, [parentId]: "" }));

addreplyMutation.mutate(
  { text, commentId: parentId },
  {
    onSuccess: (res) => {
      // استبدال البيانات من الباك
      setreplydata(prev => ({
        ...prev,
        [parentId]: res.data || prev[parentId]
      }));
       queryClient.invalidateQueries({queryKey:["comment", postId]});
    }
  }
);
};
  const handleReaction = (commentId, type) => {
    const current = active[commentId];
    setCounts(prev => {
      const { likes = 0, dislikes = 0 } = prev[commentId] || {};
      let newLikes = likes, newDislikes = dislikes;
      if (current === type) {
        type === 'like' ? newLikes-- : newDislikes--;
      } else {
        type === 'like' ? newLikes++ : newDislikes++;
        current === 'like' ? newLikes-- : current === 'dislike' ? newDislikes-- : null;
      }
      return { ...prev, [commentId]: { likes: newLikes, dislikes: newDislikes } };
    });
    setActive(prev => ({ ...prev, [commentId]: current === type ? null : type }));
   commentreactionMutation.mutate({ commentId, type }, {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey:["comment", postId]
    }
      );
  }
});
  };

  const handleTranslate = (comment) => {
    const id = comment.id;
    if (istranslate[id]) return setistranslate(prev => ({ ...prev, [id]: false }));
    if (translate[id]) return setistranslate(prev => ({ ...prev, [id]: true }));

    TranslatecommentMutaion.mutate({ commentId: id, text: comment.text }, {
      onSuccess: (res) => {
        settranslate(prev => ({ ...prev, [id]: res.data.translate }));
        setistranslate(prev => ({ ...prev, [id]: true }));
      }
    });
  };
  const handleDeleteComment = (commentId) => {
  setreplydata(prev => {
    const newData = { ...prev };
    Object.keys(newData).forEach(parentId => {
      newData[parentId] = newData[parentId].filter(c => c.id !== commentId);
    });
    return newData;
  });
  setCounts(prev => { const newCounts = { ...prev }; delete newCounts[commentId]; return newCounts; });
 deletecomment.mutate(commentId, {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey:["comment", postId]});
  }
});
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
    [id]: comment.text
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
  handleDeleteComment, currentUser, editing, menu, toggleMenu,setreplydata,resetCommentState
};
};