import Replyinput from "./Replyinput";
import HeaderPanel from "./HeaderPanel";
import MenuPanel from "./MenuPanel";
import ReactionPanel from "./ReactionPanel";
import ActionPanel from "./ActionPanel";
import { useState } from "react";
import { UseMe } from "@/hook/UseQueryMe";
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
  viewreply,currentUser,pendingTranslateId,
  t
}) => {
 const [visibleReplies, setVisibleReplies] = useState(5);
const {data}=UseMe()
  // عرض أول 2 رد
  const replies = replydata[item.id] || [];
  const hasMore = replies.length > visibleReplies;
  const MAX_LEVEL = 1;
const indent = Math.min(level, MAX_LEVEL) * 20;
  return (
    <div
      style={{ paddingLeft: indent }}
      className="flex flex-col space-y-2 mt-5"
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
      <div className=" flex justify-between ml-12">
      {/* text */}
      <p className="text-md dark:text-gray-100">
        {istranslate[item.id] ? translate[item.id] : item.content}
      </p>
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
            />
          ))}
           {hasMore && (
        <button
          className="text-blue-500 text-sm ml-4"
          onClick={() => setVisibleReplies(prev => prev + 5)} // عرض 5 زيادة
        >
          Show more ({replies.length - visibleReplies} more)
        </button>
      )}
        </div>
        
      )}
      
    </div>
  );
};

export default CommentItem;