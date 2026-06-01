import React, { useEffect, useState } from 'react'
import CustomTooltip from './ReactioHover';
import { FaRegCommentDots } from "react-icons/fa";
import { usereaction } from '@/hook/UseMutationreact';
import { useQueryClient } from '@tanstack/react-query';
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { motion } from 'framer-motion';
import { usesave } from '@/hook/UseMutationSave';

const Reaction = ({ post, onOpenReaction, onClose, reactionData, incrementComment, commentCount, onOpenComments, customClass = '' }) => {

  const [active, setactive] = useState({
    useful:           post.user_reaction === "useful",
    not_useful:       post.user_reaction === "not_useful",
    creative_solution:post.user_reaction === "creative_solution",
    same_problem:     post.user_reaction === "same_problem",
  });
  const [localCounts, setLocalCounts] = useState(post.reaction_counts || {});

  useEffect(() => {
    setactive({
      useful:           post.user_reaction === "useful",
      not_useful:       post.user_reaction === "not_useful",
      creative_solution:post.user_reaction === "creative_solution",
      same_problem:     post.user_reaction === "same_problem",
    });
    setLocalCounts(post.reaction_counts || {});
  }, [post.user_reaction, post.reaction_counts]);

  const queryClient   = useQueryClient()
  const reactionMutation = usereaction();

  const handlereaction = async (type) => {
    const previousActive = { ...active };
    const previousCounts = { ...localCounts };
    await queryClient.cancelQueries({ queryKey: ["posts"] });

    setactive(prev => {
      const reset = { useful: false, not_useful: false, same_problem: false, creative_solution: false };
      return prev[type] ? reset : { ...reset, [type]: true };
    });

    setLocalCounts(prev => {
      const next = { ...prev };
      Object.keys(active).forEach(key => {
        if (active[key] && next[key] > 0) next[key] -= 1;
      });
      if (!active[type]) next[type] = (next[type] || 0) + 1;
      return next;
    });

    reactionMutation.mutate(
      { postId: post.id, reaction_type: type },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
        onError:   () => { setactive(previousActive); setLocalCounts(previousCounts); }
      }
    );
  };

  const [localIsSaved, setLocalIsSaved] = useState(post.is_saved || false);
  useEffect(() => { setLocalIsSaved(post.is_saved || false); }, [post.is_saved]);
  const saveMutation = usesave();

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    const prev = localIsSaved;
    setLocalIsSaved(!prev);
    saveMutation.mutate(
      { postId: post.id },
      {
        onSuccess: (res) => {
          setLocalIsSaved(res.data.is_saved);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: () => setLocalIsSaved(prev)
      }
    );
  };

  return (
    <div className={`flex items-center   gap-2 ${customClass || 'justify-between'}`}>

      {/* زر التعليقات */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpenComments(); }}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl shadow-sm border border-gray-200 dark:bg-dark-button dark:border-none"
      >
        <FaRegCommentDots className="text-base text-gray-600 dark:text-gray-200" />
        <span className="text-xs font-semibold text-gradient">
          {commentCount ?? post.total_comments ?? 0}
        </span>
      </button>

      {/* أزرار التفاعل */}
      <div className="flex items-center gap-2.5">
        {reactionData.map((item) => (
          <CustomTooltip key={item.key} text={item.label}>
            <button
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border shadow-sm dark:bg-dark-button transition-colors ${
                active[item.key]
                  ? 'border-follow-button dark:border-follow-button'
                  : 'border-gray-200 dark:border-dark-button'
              }`}
            >
              {/* الأيقونة */}
              <span
                onClick={(e) => { e.stopPropagation(); handlereaction(item.key); onClose(); }}
                className={`text-base leading-none transition-colors ${
                  active[item.key] ? 'text-follow-button' : 'text-gray-600 dark:text-gray-200'
                }`}
              >
                {item.icon}
              </span>

              {/* العداد */}
              <motion.span
                key={localCounts[item.key]}
                initial={{ scale: active[item.key] ? 1.4 : 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 12 }}
                onClick={(e) => { e.stopPropagation(); onOpenReaction(item.key); }}
                className={`text-xs font-semibold transition-colors ${
                  active[item.key] ? 'text-edit-button' : 'text-gradient'
                }`}
              >
                {localCounts[item.key] || 0}
              </motion.span>
            </button>
          </CustomTooltip>
        ))}
      </div>

      {/* زر الحفظ */}
      <div onClick={handleSaveToggle} className="cursor-pointer">
        {localIsSaved
          ? <GoBookmarkFill className="text-2xl text-blue-600 transition-colors duration-300" />
          : <GoBookmark     className="text-2xl text-gray-500 dark:text-gray-300 transition-colors duration-300" />
        }
      </div>

    </div>
  )
}

export default Reaction