import Replyinput from "./Replyinput";
import HeaderPanel from "./HeaderPanel";
import MenuPanel from "./MenuPanel";
import ReactionPanel from "./ReactionPanel";
import ActionPanel from "./ActionPanel";
import { useState,useRef,useEffect } from "react";
import { UseMe } from "@/hook/UseQueryMe";
import {AnimatePresence, motion } from "framer-motion";
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
  viewreply,currentUser,pendingTranslateId,highlightedCommentId,
  t
}) => {
 const [visibleReplies, setVisibleReplies] = useState(5);
const {data}=UseMe()
const [showFullComment, setShowFullComment] = useState(false);

  // 🌟 2. تحديد النص الحالي (هل هو المترجم أم الأصلي؟) بناءً على حالة الترجمة
  const activeContent = istranslate[item.id] ? translate[item.id] : item.content;

  // 🌟 3. منطق فحص طول التعليق والقص (نفس فكرة الـ BodyPost)
  const commentLines = activeContent ? String(activeContent).split('\n') : [];
  const shouldTruncateComment = commentLines.length > 3 || (activeContent && activeContent.length > 180);

  // إذا ضغط المستخدم على زر "المزيد" أو كان النص قصيراً، يعرض النص كاملاً، وإلا يقصّه
  const displayCommentContent = showFullComment || !shouldTruncateComment
    ? activeContent
    : commentLines.slice(0, 2).join('\n').substring(0, 160) + "...";

  // إعادة تعيين حالة "المزيد" إلى false إذا قام المستخدم بإلغاء الترجمة أو تغييرها
  useEffect(() => {
    setShowFullComment(false);
  }, [istranslate[item.id]]);
  // عرض أول 2 رد
  const replies = replydata[item.id] || [];
  const hasMore = replies.length > visibleReplies;
  const MAX_LEVEL = 1;
const indent = Math.min(level, MAX_LEVEL) * 20;
const isHighlighted = Number(item.id) === Number(highlightedCommentId);
const commentRef = useRef(null);

  // 🌟 مراقبة حالة الهايلايت: إذا كان هذا هو التعليق المطلوب، انزل إليه تلقائياً
  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      setTimeout(() => {
        commentRef.current.scrollIntoView({
          behavior: 'smooth', // حركة انزلاق سلسة
          block: 'center'     // يضع التعليق في منتصف القائمة تماماً
        });
      }, 300); // تأخير بسيط 300ms ليعطي الـ Sidebar وقتاً ليفتح بالأنيميشن الخاص به أولاً
    }
  }, [isHighlighted]);
  return (
   <motion.div
   ref={commentRef}
  layout // ضروري جداً لجعل العناصر "تنزلق" مكان العنصر المحذوف
      initial={{ opacity: 1 }} // نبدأ من الحالة الظاهرة مباشرة
      exit={{ 
        opacity: 0, 
        x: -20, // إزاحة بسيطة لليسار تشبه تليغرام
        transition: { duration: 0.4, ease: "easeIn" } 
      }}
      animate={isHighlighted ? {
    backgroundColor: [
      "rgba(0, 0, 0, 0)",        // شفاف
      "rgba(229, 231, 235, 1)",  // رمادي واضح (يوازي bg-gray-200)
      "rgba(229, 231, 235, 0.4)",// رمادي خفيف جداً
      "rgba(229, 231, 235, 1)",  // وميض رمادي مرة أخرى
      "rgba(0, 0, 0, 0)"         // يتلاشى تماماً ويعود شفافاً
    ],
    borderRadius: "12px",
    padding: "8px"
  } : { backgroundColor: "rgba(0, 0, 0, 0)" }}
  
  // 🌟 زيادة سرعة الوميض ليصبح حركياً ومطابقاً للفيسبوك (duration: 2 أو 1.8 ثانية)
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
        />
       { Number(item?.user_id) === Number(data?.id) &&(
          <MenuPanel
            id={item.id}
            menu={menu}
            toggleMenu={toggleMenu}
            onEdit={() => handleEditClick(item)}
            onDelete={() =>{
               console.log("item.id:", item.id, "item.parent_id:", item.parent_id, "item.parentId:", item.parentId);
                handleDeleteComment(item.id, item.parent_id || item.parentId)}}
          />
        )}
      </div>
     
    <div className="flex justify-between ms-12 items-start space-x-2 ">
        {/* text */}
        <div className="flex flex-col items-start flex-1">
          <p 
            className="text-md dark:text-gray-100 whitespace-pre-wrap break-words w-full"
          
          >
            {displayCommentContent}
              {shouldTruncateComment && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="  font-medium transition-colors text-xs text-gray-600"
            >
              {showFullComment ? t('showless') || "Show less" : t('showmore') || "Show more"}
            </button>
          )}
          </p>
          
          {/* 🌟 زر "عرض المزيد / عرض أقل" المخصص للتعليق */}
        
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
        /></div>
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
        <div className="relative  pl-3 mt-2 space-y-3">
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
            />
          ))}
           {hasMore && (
        <button
          className="text-blue-500 text-xs md:text-sm ms-4"
          onClick={() => setVisibleReplies(prev => prev + 5)} // عرض 5 زيادة
        >
          Show more ({replies.length - visibleReplies} more)
        </button>
      )}</AnimatePresence>
        </div>
        
      )}
      
    </motion.div>
  );
};

export default CommentItem;