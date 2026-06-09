import Replyinput from "./Replyinput";
import HeaderPanel from "./HeaderPanel";
import MenuPanel from "./MenuPanel";
import ReactionPanel from "./ReactionPanel";
import ActionPanel from "./ActionPanel";
import { useState, useRef, useEffect } from "react";
import { UseMe } from "@/hook/UseQueryMe";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
const CommentItem = ({
  item,
  level = 0,
  type,
  menu,
  toggleMenu,
  handleEditClick,
  handleDeleteComment,
  istranslate,
  translate,
  counts,
  countreply = {},
  handleReaction,
  handleTranslate,
  handleReplyClick,
  handleViewreply,
  replydata,
  replyInput,
  replyText,
  setreplyText,
  handlesendreply,
  viewreply,
  currentUser,
  pendingTranslateId,
  highlightedCommentId,
  t
}) => {
  const{i18n}=useTranslation()
  const isRtl = i18n.language === "ar";
  const [visibleReplies, setVisibleReplies] = useState(5);
  const { data } = UseMe();
  const [showFullComment, setShowFullComment] = useState(false);

  const activeContent = istranslate[item.id] ? translate[item.id] : item.content;

  const commentLines = activeContent ? String(activeContent).split('\n') : [];
  const shouldTruncateComment = commentLines.length > 3 || (activeContent && activeContent.length > 180);

  const displayCommentContent = showFullComment || !shouldTruncateComment
    ? activeContent
    : commentLines.slice(0, 2).join('\n').substring(0, 160) + "...";

  useEffect(() => {
    setShowFullComment(false);
  }, [istranslate[item.id]]);

  const replies = replydata[item.id] || [];
  const hasMore = replies.length > visibleReplies;
  const MAX_LEVEL = 1;
  const indent = Math.min(level, MAX_LEVEL) * 20;
  const isHighlighted = Number(item.id) === Number(highlightedCommentId);
  const commentRef = useRef(null);

  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      setTimeout(() => {
        commentRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [isHighlighted]);

  return (
    <motion.div
      ref={commentRef}
      // ✅ هذا الـ id ضروري لـ getElementById في PostCard لعمل الـ scroll
      id={`comment-${item.id}`}
      layout
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        x: -20,
        transition: { duration: 0.4, ease: "easeIn" }
      }}
      animate={isHighlighted ? {
        backgroundColor: [
          "rgba(0, 0, 0, 0)",
          "rgba(229, 231, 235, 1)",
          "rgba(229, 231, 235, 0.4)",
          "rgba(229, 231, 235, 1)",
          "rgba(0, 0, 0, 0)"
        ],
        borderRadius: "12px",
        padding: "8px"
      } : { backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={isHighlighted ? { duration: 2, ease: "easeInOut" } : { duration: 0.2 }}
      style={{ paddingLeft: indent + (isHighlighted ? 8 : 0) }}
      className="flex flex-col space-y-2 mt-5 dark:bg-transparent"
    >

      {/* header + menu */}
      <div className="flex justify-between items-center">
        <HeaderPanel
          user={item}
          createdAt={item.created_at}
          type={type}
          level={level}
          currentUserId={data?.id}
        />
        {Number(item?.user_id) === Number(data?.id) && (
          <MenuPanel
            id={item.id}
            menu={menu}
            toggleMenu={toggleMenu}
            onEdit={() => handleEditClick(item)}
            onDelete={() => {
              console.log("item.id:", item.id, "item.parent_id:", item.parent_id, "item.parentId:", item.parentId);
              handleDeleteComment(item.id, item.parent_id || item.parentId);
            }}
          />
        )}
      </div>

      <div className="flex justify-between ms-12   items-start space-x-2">
        {/* text */}
        <div className={`flex flex-col items-start ${isRtl?"ms-12":"me-12"} flex-1`}>
          <p  className=" whitespace-pre-wrap md:text-md text-sm dark:text-gray-100 break-words w-full" dir="auto">
            {displayCommentContent}
            {shouldTruncateComment && (
              <button
                onClick={() => setShowFullComment(!showFullComment)}
                className="font-medium transition-colors text-xs text-gray-600 ms-2"
              >
                {showFullComment ? t('showless') || "Show less" : t('showmore') || "Show more"}
              </button>
            )}
          </p>
        </div>

        {/* reactions */}
        {type === "comments" && (
          <ReactionPanel
            id={item.id}
            counts={counts}
            handleReaction={handleReaction}
          />
        )}
      </div>

      {/* actions */}
      {type === "comments" && (
        <div>
          <ActionPanel
            item={item}
            repliesCount={countreply?.[item.id] ?? item.replies_count ?? 0}
            istranslate={istranslate}
            handleTranslate={handleTranslate}
            handleReplyClick={handleReplyClick}
            handleViewreply={handleViewreply}
            pendingTranslateId={pendingTranslateId}
            replydata={replydata}
            t={t}
          />
        </div>
      )}

      {/* input */}
      {replyInput[item.id] && (
        <Replyinput
          value={replyText[item.id] || ""}
          onChange={(e) =>
            setreplyText(prev => ({
              ...prev,
              [item.id]: e.target.value
            }))
          }
          onSend={() => handlesendreply(item.id)}
        />
      )}

      {/* replies */}
      {viewreply[item.id] && (
        <div className="relative pl-3 mt-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {replies.slice(0, visibleReplies).map(reply => (
              <CommentItem
                key={reply.id}
                item={reply}
                countreply={countreply}
                level={level + 1}
                type={type}
                menu={menu}
                toggleMenu={toggleMenu}
                handleEditClick={handleEditClick}
                handleDeleteComment={handleDeleteComment}
                istranslate={istranslate}
                translate={translate}
                counts={counts}
                handleReaction={handleReaction}
                handleTranslate={handleTranslate}
                handleReplyClick={handleReplyClick}
                handleViewreply={handleViewreply}
                replydata={replydata}
                replyInput={replyInput}
                replyText={replyText}
                setreplyText={setreplyText}
                handlesendreply={handlesendreply}
                viewreply={viewreply}
                pendingTranslateId={pendingTranslateId}
                t={t}
                highlightedCommentId={highlightedCommentId}
                currentUser={currentUser}
              />
            ))}
            {hasMore && (
              <button
                className="text-blue-500 text-xs md:text-sm ms-4"
                onClick={() => setVisibleReplies(prev => prev + 5)}
              >
                Show more ({replies.length - visibleReplies} more)
              </button>
            )}
          </AnimatePresence>
        </div>
      )}

    </motion.div>
  );
};

export default CommentItem;
