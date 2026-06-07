import React, { useState } from 'react'
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'
import SidebarPanel from './Sidepanel'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { PiBugBeetle } from "react-icons/pi";
import { MdLightbulbOutline } from "react-icons/md";
import { usequeryreaction } from '@/hook/UseQueryreact';
import { useaddcomment } from '@/hook/UseMutationComment';
import { usecomment } from '@/hook/UseQueryComment';
import { useEffect } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6';
import { useQueryClient } from "@tanstack/react-query";
import Trending from './Trending';
import { UseMe } from '@/hook/UseQueryMe'
import { useLocation } from 'react-router-dom';
const PostCard = ({
  post,
  customWidth,
  commentClass,
  HeaderClass,
  bodyClass,
  reactionClass,
  scrollToCommentId,
  autoOpenComments,
  removeTopMargin,   // ✅ prop
  isInProfilePage,   // ✅ prop
  compact,           // ✅ prop
  handleOpenPost,    // ✅ prop
}) => {
  const { t } = useTranslation()
  const location = useLocation();
  const { data: currentUser } = UseMe();
  const [sort, setsort] = useState('latest');
  const [paneltype, setpaneltype] = useState(autoOpenComments ? 'comments' : null);
  const [commentCount, setCommentCount] = useState(post.total_comments)
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);

  useEffect(() => {
    setCommentCount(post.total_comments);
  }, [post.total_comments]);

  const handleTogglePanel = (type) => {
    setpaneltype(prev => prev === type ? null : type);
  };

  const handleToggleComments = () => {
    setpaneltype(prev => prev === 'comments' ? null : 'comments');
  };

  const handleClose = () => {
    setpaneltype(null);
    setHighlightedCommentId(null);
  };

  const handleBestAnswerFound = (commentId) => {
    setHighlightedCommentId(commentId);
    setpaneltype('comments');
  };

  const commentsData = usecomment(post.id, sort);
  const data = usequeryreaction(post.id, paneltype !== "comments" ? paneltype : null);
  const queryClient = useQueryClient();

  const reactionData = [
    { key: "useful",            label: t("useful"),            count: post.reaction_counts?.useful,            icon: <AiOutlineLike     className='dark:text-gray-50' /> },
    { key: "not_useful",        label: t("not_useful"),        count: post.reaction_counts?.not_useful,        icon: <AiOutlineDislike  className='dark:text-gray-50' /> },
    { key: "creative_solution", label: t("creative_solution"), count: post.reaction_counts?.creative_solution, icon: <MdLightbulbOutline className='dark:text-gray-50' /> },
    { key: "same_problem",      label: t("same_problem"),      count: post.reaction_counts?.same_problem,      icon: <PiBugBeetle       className='dark:text-gray-50' /> }
  ];

  const reactionMap = Object.fromEntries(reactionData.map(item => [item.key, item]));
  const addcommntMutation = useaddcomment();

  const handleAddComment = ({ postId, text }) => {
    if (!text.trim()) return;
    setCommentCount(prev => prev + 1);
    const tempId = Date.now();
    const optimisticComment = {
      id: tempId,
      content: text,
      user_username: currentUser?.username,
      user_photo_url: currentUser?.personal_photo_url,
      created_at: new Date().toISOString(),
      likes: 0, dislikes: 0, replies_count: 0, is_optimistic: true
    };
    queryClient.setQueriesData({ queryKey: ['comment', postId] }, (oldData) => {
      if (!oldData) return [optimisticComment];
      if (oldData.data) return { ...oldData, data: [optimisticComment, ...oldData.data] };
      return [optimisticComment, ...oldData];
    });
    addcommntMutation.mutate(
      { postId, content: text },
      {
        onSuccess: (res) => {
          queryClient.setQueriesData({ queryKey: ['comment', postId] }, (oldData) => {
            const serverComment = res.data?.comment;
            const update = (list) => list.map(c => c.id === tempId ? serverComment : c);
            if (oldData?.data) return { ...oldData, data: update(oldData.data) };
            return Array.isArray(oldData) ? update(oldData) : oldData;
          });
        },
        onError: () => {
          setCommentCount(prev => prev - 1);
          queryClient.invalidateQueries({ queryKey: ['comment', postId] });
        }
      }
    );
  };

useEffect(() => {
    let activeCommentId = scrollToCommentId || location.state?.scrollToComment || null;

    // إذا لم يجده في الـ state، يقرأه من الـ URL Query Params
    if (!activeCommentId) {
      const searchParams = new URLSearchParams(location.search);
      activeCommentId = searchParams.get('comment');
    }

    if (activeCommentId) {
      // فتح السايد بار فوراً إذا كان مغلقاً
      setpaneltype('comments');
      // تخزين المعرف في السيرفر/الحالة للبدء بالـ scroll والـ highlight
      setHighlightedCommentId(activeCommentId);

      // 🌟 خطوة ذكية: تنظيف الـ URL حتى لا يظل يعيد فتح السايد بار إذا أغلقه المستخدم يدوياً
      if (location.search.includes('comment=')) {
        window.history.replaceState(null, '', location.pathname);
      }
    }
  }, [scrollToCommentId, location.state?.scrollToComment, location.search]);


  // 🌟 2. الـ useEffect الثاني: مسؤول فقط عن عمل الـ Scroll والـ Highlight (بشرط أن يكون السايد بار مفتوحاً والبيانات جاهزة)
  useEffect(() => {
    // نتحقق أن السايد بار مفتوح، وهناك تعليق مستهدف، والبيانات تم تحميلها بنجاح
    if (highlightedCommentId && paneltype === 'comments' && commentsData) {
      const timer = setTimeout(() => {
        const commentElement = document.getElementById(`comment-${highlightedCommentId}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // ✅ إزالة الـ highlight تلقائياً بعد 2.5 ثانية لإعادة الكومبوننت لوضعه الطبيعي دون إغلاق السايد بار
        const highlightTimer = setTimeout(() => {
          setHighlightedCommentId(null);
        }, 2500);

        return () => clearTimeout(highlightTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [highlightedCommentId, paneltype, commentsData]);

  return (
    <div className={`bg-white dark:bg-dark-post-background rounded-2xl shadow-lg border border-gray-200 px-4 dark:border-0 h-fit p-4 md:p-5 flex flex-col gap-8 ${removeTopMargin ? "mt-0" : "md:mt-5 mt-10"} ${customWidth || 'w-full'}`}>
      <Trending post={post} />
      <HeaderPost post={post} customClass={HeaderClass} isInProfilePage={isInProfilePage} />
      <BodyPost
        post={post}
        customClass={bodyClass}
        compact={compact}
        onOpenPost={compact ? handleOpenPost : undefined}
      />
      <Reaction
        post={post}
        onOpenReaction={handleTogglePanel}
        onClose={handleClose}
        reactionData={reactionData}
        incrementComment={() => setCommentCount(prev => prev + 1)}
        commentCount={commentCount}
        onOpenComments={handleToggleComments}
        customClass={reactionClass}
      />
      <AnimatePresence>
        {paneltype && (
          <SidebarPanel
            key={paneltype}
            type={paneltype}
            title={paneltype === "comments" ? t("comments") : reactionMap[paneltype]?.label}
            icon={paneltype === "comments" ? <FaRegCommentDots /> : reactionMap[paneltype]?.icon}
            items={paneltype === "comments" ? (commentsData || []) : (data || [])}
            currentUser={currentUser}
            showFilter={paneltype === "comments"}
            sort={sort}
            setSort={setsort}
            onClose={handleClose}
            postId={post.id}
            setCommentCount={setCommentCount}
            highlightedCommentId={highlightedCommentId}
          />
        )}
      </AnimatePresence>
      <Comment post={post} onAddComment={handleAddComment} onBestAnswerFound={handleBestAnswerFound} />
    </div>
  )
}

export default PostCard
