import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import HeaderPost from './HeaderPost'
import BodyPost from './BodyPost'
import Reaction from './Reaction'
import Comment from './Comment'
import SidebarPanel from './Sidepanel'
import { useNavigate } from 'react-router-dom';
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

const PostCard = ({post, customWidth, commentClass, HeaderClass, bodyClass, reactionClass, scrollToCommentId, removeTopMargin = false , autoOpenComments,compact = false,isInProfilePage}) => {
  const location = useLocation();
  const { t } = useTranslation()
  const { data: currentUser } = UseMe();
  const [sort, setsort] = useState('latest');
  const [paneltype, setpaneltype] = useState(autoOpenComments ? 'comments' : null);
  const [commentCount, setCommentCount] = useState(post.total_comments)
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);
const navigate = useNavigate();
const handleOpenPost = () => {
  navigate(`/post/${post.id}`, {
    state: { post }
  });
};
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


  // 2. أضيفي هذا الـ useEffect لفتح قائمة التعليقات تلقائياً فوراً إذا كان هناك تعليق مستهدف قادم من الإشعارات
  useEffect(() => {
    if (highlightedCommentId && post?.id) {
      // استدعي الدالة المسؤولة عن فتح السايد بانل للتعليقات في مشروعك
      // بناءً على ملفك، الدالة هي handleToggleComments أو setNewPanelType("comments")
      if (typeof handleToggleComments === 'function') {
        handleToggleComments();
      } else if (typeof setpaneltype === 'function') {
        setpaneltype("comments"); 
      }
    }
  }, [highlightedCommentId, post?.id]);
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
    if (scrollToCommentId && paneltype === 'comments') {
      const timer = setTimeout(() => {
        // ✅ scroll للتعليق
        const commentElement = document.getElementById(`comment-${scrollToCommentId}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // ✅ شغّل الـ highlight عبر framer-motion في CommentItem
        setHighlightedCommentId(scrollToCommentId);

        // ✅ أزل الـ highlight بعد 2.5 ثانية
        setTimeout(() => {
          setHighlightedCommentId(null);
        }, 2500);

      }, 400);

      return () => clearTimeout(timer);
    }
  }, [scrollToCommentId, paneltype, commentsData]);

  return (
    <div className={`bg-white dark:bg-dark-post-background rounded-2xl shadow-lg border border-gray-200 px-4 dark:border-0 h-fit p-4 md:p-5 flex flex-col gap-8      ${removeTopMargin ? "mt-0" : "md:mt-5 mt-10"} ${customWidth || 'w-full'}`}>
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