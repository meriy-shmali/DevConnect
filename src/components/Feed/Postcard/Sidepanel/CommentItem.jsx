import Replyinput from "./Replyinput";
import HeaderPanel from "./HeaderPanel";
import MenuPanel from "./MenuPanel";
import ReactionPanel from "./ReactionPanel";
import ActionPanel from "./ActionPanel";
import { useState } from "react";
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
  handleReaction,
  handleTranslate,
  handleReplyClick,
  handleViewreply,
  replydata,
  replyInput,
  replyText,
  setreplyText,
  handlesendreply,
  viewreply,currentUser,
  t
}) => {
 const [visibleReplies, setVisibleReplies] = useState(5); // عرض أول 2 رد
  const replies = replydata[item.id] || [];
  const hasMore = replies.length > visibleReplies;
  const MAX_LEVEL = 1;
const indent = Math.min(level, MAX_LEVEL) * 20;
  return (
    <div
      style={{ paddingLeft: indent }}
      className="flex flex-col space-y-2"
    > 
      {/* header + menu */}
      <div className="flex justify-between items-center">
        <HeaderPanel
          user={item.user}
          createdAt={item.createdAt}
          type={type}
          level={level}
        />
        {item.user?.name === /*currentUser?.id*/"You" && (
          <MenuPanel
            id={item.id}
            menu={menu}
            toggleMenu={toggleMenu}
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteComment(item.id)}
          />
        )}
      </div>
      <div className=" flex justify-between ml-12">
      {/* text */}
      <p className="text-md">
        {istranslate[item.id] ? translate[item.id] : item.text}
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
          istranslate={istranslate}
          handleTranslate={handleTranslate}
          handleReplyClick={handleReplyClick}
          handleViewreply={handleViewreply}
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