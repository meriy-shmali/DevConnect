import { useState, useEffect } from "react";
import { usecommentreaction, useDeletecomment, usetranslatecomment,useEditcomment, useaddreply } from "@/hook/UseMutationComment";
import { usegetreplies } from "@/hook/UseQueryComment";
import { staticReplies } from "@/Utils/data/staticReplies";
import { useAuth } from "@/context/AuthContext";
import {useQueryClient } from "@tanstack/react-query";
import { UseMe } from "./UseQueryMe";
export const useCommentLogic = (items = [],postId,setCommentCount) => {
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
  const [pendingTranslateId, setPendingTranslateId] = useState(null);
  console.log(TranslatecommentMutaion) 
  const deletecomment = useDeletecomment();
  const addreplyMutation = useaddreply()
  const  queryClient=useQueryClient()
const { data: fetchedReplies = [] } = usegetreplies(activeCommentId, !!activeCommentId);

  const toggleMenu = (id) => {
  setMenu(prev => ({
    ...prev,
    [id]: !prev[id] //بحافظ على القيم القديمة وبعكس القيمة الجديدة 
  }));
};
const [counts, setCounts] = useState({});
const [active, setActive] = useState({});
// التعديل في useEffect الخاص بالردود
useEffect(() => {
  if (activeCommentId && fetchedReplies && fetchedReplies.length > 0) {
    setreplydata(prev => {
      // لا تحدث البيانات إذا كانت موجودة مسبقاً ولديكِ تعديلات يدوية عليها
      if (prev[activeCommentId] && prev[activeCommentId].some(r => r.is_optimistic)) return prev;
      
      return {
        ...prev,
        [activeCommentId]: fetchedReplies
      };
    });
  }
}, [fetchedReplies, activeCommentId]);
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
 
};
/*const handlesendreply = (parentId) => {
  const text = replyText[parentId];
  if (!text?.trim()) return;

  const tempId = Date.now();
  const optimisticReply = {
    id: tempId,
    content: text,
    user_username: currentUser?.username,
    user_photo_url: currentUser?.personal_photo_url,
    created_at: new Date().toISOString(),
    likes: 0, dislikes: 0, replies_count: 0,
    is_optimistic: true
  };

  // الحالة الأولى: التعديل
  if (editing[parentId]) {
    setreplydata(prev => ({
      ...prev,
      [parentId]: (prev[parentId] || []).map(r => r.id === parentId ? { ...r, content: text } : r)
    }));
    setEditing(prev => ({ ...prev, [parentId]: false }));
    setReplyInput(prev => ({ ...prev, [parentId]: false }));
    editComment.mutate({ commentId: parentId, content: text });
    return;
  }

  // الحالة الثانية: إضافة رد جديد 🚀
  // 1. زيادة عداد الردود المحلي فوراً
  setcountreply(prev => ({ ...prev, [parentId]: (Number(prev[parentId]) || 0) + 1 }));

  // 2. إظهار الرد في القائمة فوراً
  setreplydata(prev => ({
    ...prev,
    [parentId]: [...(prev[parentId] || []), optimisticReply]
  }));

  // 3. تحديث العداد داخل الكاش الرئيسي (ليظهر في الواجهة)
  queryClient.setQueriesData({ queryKey: ['comment', postId] }, (old) => {
    const update = (list) => list.map(c => c.id === parentId ? { ...c, replies_count: (c.replies_count || 0) + 1 } : c);
    if (old?.data) return { ...old, data: update(old.data) };
    return Array.isArray(old) ? update(old) : old;
  });

  setreplyText(prev => ({ ...prev, [parentId]: "" }));
  setReplyInput(prev => ({ ...prev, [parentId]: false }));

  addreplyMutation.mutate(
    { postId, content: text, parent: parentId },
    {
     // داخل onSuccess تبع addreplyMutation في ملف CommentLogic
onSuccess: (res) => {
  console.log("server reply raw:", res.data);

 const raw = res.data.comment;
  const serverReply = {
      ...raw,
  likes: raw.useful_count ?? 0,
  dislikes: raw.not_useful_count ?? 0,
 user_id: raw.user_id ?? currentUser?.id,
 is_optimistic: false
  };

  setreplydata(prev => ({
    ...prev,
    [parentId]: (prev[parentId] || []).map(r =>
      r.id === tempId ? serverReply : r
    )
  }));

  queryClient.setQueryData(['replies', parentId], (old) => {
    return old
      ? [...old.filter(r => r.id !== tempId), serverReply]
      : [serverReply];
  });
  
},
      onError: () => {
        // Rollback
        setreplydata(prev => ({ ...prev, [parentId]: (prev[parentId] || []).filter(r => r.id !== tempId) }));
        setcountreply(prev => ({ ...prev, [parentId]: Math.max(0, (prev[parentId] || 1) - 1) }));
      }
    }
  );
};*/
const handlesendreply = (parentId) => {
  if (!postId) {
    console.error("Post ID is missing!");
    return;
  }
  const text = replyText[parentId];
  if (!text?.trim()) return;

  const tempId = Date.now();
  

  // --- الحالة الأولى: التعديل (نفس منطق الحذف السريع) ---
  if (editing[parentId]) {
    const newText = text;

    // 1. تحديث الردود في الحالة المحلية (Local State) فوراً
    setreplydata(prev => {
      const newData = { ...prev };
      Object.keys(newData).forEach(key => {
        if (newData[key]) {
          newData[key] = newData[key].map(r => 
            r.id === parentId ? { ...r, content: newText } : r
          );
        }
      });
      return newData;
    });

    // 2. تحديث الكاش الرئيسي (React Query) فوراً (لتعليقات المنشور)
   // 2. تحديث الكاش الرئيسي (React Query) فوراً
queryClient.setQueryData(['comment', postId], (old) => {
  if (!old) return old;

  const updateInList = (list) => {
    if (!Array.isArray(list)) return list;
    return list.map(c => c.id === parentId ? { ...c, content: newText } : c);
  };

  // إذا كان Infinite Query (يحتوي على صفحات)
  if (old.pages) {
    return {
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        // نتحقق إذا كانت النتائج داخل results أو هي الصفحة نفسها
        results: page.results ? updateInList(page.results) : updateInList(page)
      }))
    };
  }

  // إذا كانت البيانات مصفوفة مباشرة أو داخل كائن data
  if (Array.isArray(old)) return updateInList(old);
  if (old.data) return { ...old, data: updateInList(old.data) };

  return old;
});

    // 3. تحديث كاش الردود المنفصل (لو كان العنصر ردّاً)
    // نبحث عن الأب الحقيقي لهذا الرد ونحدثه في كاش الردود
    queryClient.setQueriesData({ queryKey: ['replies'] }, (old) => {
      if (!old) return old;
      return old.map(r => r.id === parentId ? { ...r, content: newText } : r);
    });

    // تنظيف الواجهة فوراً
    setEditing(prev => ({ ...prev, [parentId]: false }));
    setReplyInput(prev => ({ ...prev, [parentId]: false }));
    setreplyText(prev => ({ ...prev, [parentId]: "" }));
    
    // إرسال للسيرفر في الخلفية
    editComment.mutate({ commentId: parentId, content: newText }, {
      onError: () => {
        // لو فشل السيرفر، اعمل ريفريش للتصحيح
      /*  queryClient.invalidateQueries({ queryKey: ['comment', postId] });*/
      }
    });
    return;
  }

  // --- الحالة الثانية: إضافة رد جديد (كودك الأصلي كما هو) ---
  const optimisticReply = {
    id: tempId,
    content: text,
    user_username: currentUser?.username,
    user_photo_url: currentUser?.personal_photo_url,
    created_at: new Date().toISOString(),
    likes: 0, 
    dislikes: 0, 
    replies_count: 0,
    is_optimistic: true
  };

  setcountreply(prev => ({ ...prev, [parentId]: (Number(prev[parentId]) || 0) + 1 }));

  setreplydata(prev => ({
    ...prev,
    [parentId]: [...(prev[parentId] || []), optimisticReply]
  }));

  queryClient.setQueriesData({ queryKey: ['comment', postId] }, (old) => {
    const update = (list) => list.map(c => c.id === parentId ? { ...c, replies_count: (c.replies_count || 0) + 1 } : c);
    if (!old) return old;
    if (old.pages) {
        return {
          ...old,
          pages: old.pages.map(page => ({ ...page, results: update(page.results) }))
        };
    }
    return old.data ? { ...old, data: update(old.data) } : update(old);
  });

  setreplyText(prev => ({ ...prev, [parentId]: "" }));
  setReplyInput(prev => ({ ...prev, [parentId]: false }));

  addreplyMutation.mutate(
    { postId, content: text, parent: parentId },
    {
      onSuccess: (res) => {
        const raw = res.data.comment;
        const serverReply = {
          ...raw,
          likes: raw.useful_count ?? 0,
          dislikes: raw.not_useful_count ?? 0,
          user_id: raw.user_id ?? currentUser?.id,
          is_optimistic: false
        };

        setreplydata(prev => ({
          ...prev,
          [parentId]: (prev[parentId] || []).map(r => r.id === tempId ? serverReply : r)
        }));

        queryClient.setQueryData(['replies', parentId], (old) => {
          return old ? [...old.filter(r => r.id !== tempId), serverReply] : [serverReply];
        });
      },
      onError: () => {
        setreplydata(prev => ({ ...prev, [parentId]: (prev[parentId] || []).filter(r => r.id !== tempId) }));
        setcountreply(prev => ({ ...prev, [parentId]: Math.max(0, (prev[parentId] || 1) - 1) }));
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
       
      }
    }
  );
  };
  
  const handleTranslate = (comment) => {
  const id = comment.id;
console.log("before set pending:", pendingTranslateId);
  setPendingTranslateId(id);
  console.log("after set pending:", id);
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
         setPendingTranslateId(null);
      }
    }
  );

  };
const handleDeleteComment = (commentId, parentId = null) => {
  // 1. تحديث الواجهة فوراً (Optimistic UI)
  setreplydata(prev => {
    const newData = { ...prev };
    // إذا كان parentId موجود، نحذف من قائمته، وإذا لم يوجد، نبحث في كل القوائم
    if (parentId && newData[parentId]) {
      newData[parentId] = newData[parentId].filter(c => c.id !== commentId);
    } else {
      Object.keys(newData).forEach(key => {
        newData[key] = newData[key].filter(c => c.id !== commentId);
      });
    }
    return newData;
  });

  // 2. طلب الحذف من السيرفر
  deletecomment.mutate(commentId, {
    onSuccess: () => {
      // تحديث كاش React Query لإخفاء التعليق نهائياً
      queryClient.invalidateQueries({ queryKey: ['comment', postId] });

      if (parentId) {
        // تنقيص عداد الردود للأب
        setcountreply(prev => ({
          ...prev,
          [parentId]: Math.max(0, (prev[parentId] || 1) - 1)
        }));
      } else {
        // إذا كان تعليقاً أساسياً، ننقص عداد المنشور
        if (typeof setCommentCount === 'function') {
           setCommentCount(prev => Math.max(0, prev - 1));
        }
      }
      // إزالة كاش الردود الخاص بهذا العنصر
      queryClient.removeQueries({ queryKey: ['replies', commentId] });
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
  viewreply, replydata, replyText, replyInput, setreplyText,pendingTranslateId,
  handleDeleteComment, currentUser, editing, menu, toggleMenu,setreplydata,resetCommentState,setcountreply,countreply
};
};