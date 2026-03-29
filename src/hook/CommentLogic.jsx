import { useState, useEffect } from "react";
import { usecommentreaction, useDeletecomment, usereplycomment, usetranslatecomment } from "@/hook/UseMutationComment";
import { usegetreplies } from "@/hook/UseQueryComment";
import { staticReplies } from "@/Utils/data/staticReplies";

export const useCommentLogic = (items = []) => {
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showmenu, setshowmenu] = useState(false);

  const commentreactionMutation = usecommentreaction();
  const TranslatecommentMutaion = usetranslatecomment();
  const deletecomment = useDeletecomment();
  const addreplyMutation = usereplycomment();

  const { data: fetchedReplies } = usegetreplies(activeCommentId, !!activeCommentId);
const [showTempReply, setShowTempReply] = useState({});
  const [translate, settranslate] = useState({});
  const [istranslate, setistranslate] = useState({});
  const [viewreply, setviewreply] = useState({});
  const [replyInput, setReplyInput] = useState({});
  const [replydata, setreplydata] = useState({});
  const [replyText, setreplyText] = useState({});
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

  const isOpen = replyInput[id]; // هل الحقل مفتوح حالياً؟

  if (isOpen) {
    // إذا كان مفتوح → أغلق الحقل والردود
    setReplyInput(prev => ({ ...prev, [id]: false }));
    setviewreply(prev => ({ ...prev, [id]: false }));
  } else {
    // إذا كان مغلق → افتحه واظهر الردود
    setReplyInput(prev => ({ ...prev, [id]: true }));
    setviewreply(prev => ({ ...prev, [id]: true }));

    // نص أولي إذا ما موجود
    if (!replyText[id]) {
      setreplyText(prev => ({ ...prev, [id]: `@${comment.user?.name || ""} ` }));
    }
  }
};
  // Toggle view replies
const handleViewreply = (commentId) => {
  setviewreply(prev => ({
    ...prev,
    [commentId]: !prev[commentId]
  }));

  setActiveCommentId(commentId); // fetch
};const handlesendreply = (parentId) => {
  const text = replyText[parentId];
  if (!text?.trim()) return;

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

  // نفرغ النص فقط
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

  return {
    showmenu, setshowmenu,
    handleTranslate, istranslate, translate,
    handleReaction, counts,
    handleReplyClick, handleViewreply, handlesendreply,
    viewreply, replydata, replyText, replyInput, setreplyText,
    handleDeleteComment,showTempReply
  };
};