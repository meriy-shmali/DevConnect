import { useState, useEffect } from "react";
import { usecommentreaction, useDeletecomment, usereplycomment, usetranslatecomment,useEditcomment } from "@/hook/UseMutationComment";
import { usegetreplies } from "@/hook/UseQueryComment";
import { staticReplies } from "@/Utils/data/staticReplies";
import { useAuth } from "@/context/AuthContext";
export const useCommentLogic = (items = []) => {
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showmenu, setshowmenu] = useState(false);
  const { currentUser } = useAuth();
  const editComment=useEditcomment();
  const commentreactionMutation = usecommentreaction();
  const TranslatecommentMutaion = usetranslatecomment();
  const deletecomment = useDeletecomment();
  const addreplyMutation = usereplycomment();

  const { data: fetchedReplies } = usegetreplies(activeCommentId, !!activeCommentId);
  const [translate, settranslate] = useState({});
  const [istranslate, setistranslate] = useState({});
  const [viewreply, setviewreply] = useState({});
  const [replyInput, setReplyInput] = useState({});
  const [replydata, setreplydata] = useState({});
  const [replyText, setreplyText] = useState({});
  const [editing, setEditing] = useState({});
  const [menu, setMenu] = useState({});
  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};
  const [counts, setCounts] = useState(() => {
    const map = {};
    [...items, ...Object.values(replydata).flat()].forEach(c => {
      map[c.id] = { likes: c.likes || 0, dislikes: c.dislikes || 0 };
    });
    return map;
  });
  const [active, setActive] = useState(() => {
    const map = {};
    items.forEach(c => map[c.id] = c.userReaction || null);
    return map;
  });

  // Fetch replies when activeCommentId changes
  useEffect(() => {
    if (!activeCommentId) return;
    const replies = fetchedReplies?.length > 0
      ? fetchedReplies
      : staticReplies[activeCommentId] || [];
    setreplydata(prev => ({
      ...prev,
      [activeCommentId]: replies
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
        [id]: `@${comment.user?.name || ""} `
      }));
    }

    setActiveCommentId(id);
  }
};
  // Toggle view replies
const handleViewreply = (commentId) => {
 const isInputOpen = replyInput[commentId];

  if (isInputOpen) {
    // 🔴 إذا reply مفتوحة
    // سكّر input وخلي الردود
    setReplyInput(prev => ({
      ...prev,
      [commentId]: false
    }));

    setviewreply(prev => ({
      ...prev,
      [commentId]: true
    }));

  } else {
    // 🟢 toggle طبيعي
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

  // ✅ edit
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

    editComment.mutate({ commentId: parentId, text }); // ✅ الصح

    return;
  }

  // ✅ reply عادي
  const newReply = {
    id: Date.now(),
    text,
    user: { name: "You", avatar: "/images/default-avatar.jpg" },
    createdAt: "now"
  };

  setreplydata(prev => ({
    ...prev,
    [parentId]: [...(prev[parentId] || []), newReply]
  }));

  setreplyText(prev => ({ ...prev, [parentId]: "" }));

  addreplyMutation.mutate({ text, commentId: parentId });
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
    commentreactionMutation.mutate({ commentId, type });
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
  deletecomment.mutate(commentId);
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
 return {
  showmenu, setshowmenu,
  handleTranslate, istranslate, translate,
  handleReaction, counts,
  handleReplyClick, handleViewreply, handlesendreply, handleEditClick,
  viewreply, replydata, replyText, replyInput, setreplyText,
  handleDeleteComment, currentUser, editing, menu, toggleMenu,setreplydata
};
};