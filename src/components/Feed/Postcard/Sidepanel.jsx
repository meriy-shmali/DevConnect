import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { HiOutlineAdjustments } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useCommentLogic } from "@/hook/CommentLogic";
import { BsThreeDotsVertical } from "react-icons/bs";
  const SidebarPanel = ({
  title,icon,items,showFilter,onClose,type,sort,setSort}) => {
  const {
    showmenu, setshowmenu,
    handleTranslate, istranslate, translate,currentUser,menu,toggleMenu,
    handleReaction, counts,handleViewreply,handlesendreply,viewreply,replydata,replyText,
    setreplyText,
handleReplyClick,replyInput,editing,handleDeleteComment,handleEditClick
  } = useCommentLogic(items);
  const { t } = useTranslation();
  // 🟢 render nested replies
   const renderReplies = (parentId, level = 1) => { return replydata[parentId]?.map(reply => (
    <div key={reply.id} className={`ml-${level * 6} flex flex-col space-y-2`}>
      {/* header */}
      <div className="flex items-center space-x-2">
        <img src={reply.user?.avatar} className="w-6 h-6 rounded-full" />
        <span className="font-semibold text-sm">{reply.user?.name}</span>
        <span className="text-gray-400 text-xs">{reply.createdAt}</span>
          {reply.user?.name === /*currentUser?.id*/ "You" && (
    <div className="relative">
      <button onClick={() => toggleMenu(reply.id)}>
        <BsThreeDotsVertical />
      </button>
      {menu[reply.id] && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 flex flex-col z-50">
          <button onClick={() => handleEditClick(reply)}   className="px-3 py-1 hover:text-blue-500" >
            edit
          </button>
          <button onClick={() => handleDeleteComment(reply.id)} className="px-3 py-1 hover:text-red-500">
            delete
          </button>
        </div> )}</div>)}
      </div>   
      {/* text */}
      <p className="text-sm">
        {istranslate[reply.id] ? translate[reply.id] : reply.text}
      </p>
      {/* reactions */}
      {type=="comments"&&(
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <p>{counts[reply.id]?.likes || 0}</p>
          <button onClick={() => handleReaction(reply.id, 'like')}>
            <AiOutlineLike />
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <p>{counts[reply.id]?.dislikes || 0}</p>
          <button onClick={() => handleReaction(reply.id, 'dislike')}>
            <AiOutlineDislike />
          </button>
        </div>
      </div>)}
      {/* actions */}
    {type=="comments"&&(  <div className="flex text-sm text-gray-500 space-x-4">
        <button onClick={() => handleTranslate(reply)}>
          {istranslate[reply.id] ? t('see_original') : t('translate')}
        </button>
        <button onClick={() => handleReplyClick(reply)}>
          reply
        </button>
        <button onClick={() => handleViewreply(reply.id)}>
          {replydata[reply.id]?.length || 0} view replies
        </button>
      </div>)}
      {/* input يظهر فقط عند reply */}
      {replyInput[reply.id] && (
        <div className="flex mt-2 space-x-2">
          <input
            value={replyText[reply.id] || ""}
            onChange={e =>
              setreplyText(prev => ({ ...prev, [reply.id]: e.target.value }))
            }
            className="border p-1 rounded w-full"
            placeholder="اكتب رد..."
          />
          <button onClick={() => handlesendreply(reply.id)}>ارسال</button>
        </div>
      )}
      {/* nested replies */}
      {viewreply[reply.id] && renderReplies(reply.id, level + 1)}
    </div>
  ));
};
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 w-[800px] left-1/2" />
      <motion.div
        key={type}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3 }}
        className="sidebar fixed right-0 top-2 w-[450px] h-screen bg-white shadow-lg p-4 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-[25px]">{icon}</p>
          </div>
          <IoIosClose onClick={onClose} className="text-4xl text-red-600" />
        </div>
        {/* Filter */}
        {type === 'comments' && showFilter && (
          <div className="flex justify-end mr-1">
            <button onClick={() => setshowmenu(prev => !prev)}>
              <HiOutlineAdjustments className="text-2xl" />
            </button>
            {showmenu && (
              <div className="absolute right-14 mt-2 bg-white shadow-md rounded-md p-2 flex flex-col z-50 border border-gray-300">
                <button
                  onClick={() => {
                    setSort("latest");
                    setshowmenu(false);
                  }}
                  className="px-3 py-1 hover:text-gray-600"
                >
                  {t('latest')}
                </button>
                <button
                  onClick={() => {
                    setSort("oldest");
                    setshowmenu(false);
                  }}
                  className="px-3 py-1 hover:text-gray-600"
                >
                  {t('oldest')}
                </button>
              </div>
            )}
          </div>
        )}
        {/* Items */}
        <div className="flex-col space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 mt-16 text-xl">
              <LiaUserAltSlashSolid className="text-7xl" />
              <p>No items</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex flex-col space-y-1 pb-2">
                {/* header */}
                <div className="flex items-center space-x-3">
                  <img src={item.user?.avatar} className="w-10 h-10 rounded-full" />
                  <div className="text-md font-semibold capitalize">
                    {item.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.createdAt}
                  </div>
                </div>
                 {item.user?.name ===/* currentUser?.id*/ "You"&& (
    <div className="relative">
      <button onClick={() => toggleMenu(item.id)}>
        <BsThreeDotsVertical />
      </button>
      {menu[item.id] && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 flex flex-col z-50">
          <button onClick={() => handleEditClick(item)} className="px-3 py-1 hover:text-blue-500">
            edit
          </button>
          <button
            onClick={() => handleDeleteComment(item.id)}
            className="px-3 py-1 hover:text-red-500"
          >  delete</button>
        </div>
      )}
    </div>
  )}    {/* content */}
                <div className="flex-col space-y-6">
                  <div className="flex justify-between">
                    <p className="ml-12 text-black">
                      {istranslate[item.id] ? translate[item.id] : item.text}
                    </p>
                    {/* reactions (بدون تعديل) */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <p>{counts[item.id]?.likes || item.likes}</p>
                        <button onClick={() => handleReaction(item.id, 'like')}>
                          <AiOutlineLike />  </button></div>
                      <div className="flex items-center space-x-1">
                        <p>{counts[item.id]?.dislikes || item.dislikes}</p>
                        <button onClick={() => handleReaction(item.id, 'dislike')}>
                          <AiOutlineDislike />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex text-sm text-gray-500 space-x-4">
                    <button onClick={() => handleTranslate(item)}>
                      {istranslate[item.id] ? t('see_original') : t('translate')}
                    </button>
                    <button onClick={() => handleReplyClick(item)}>
                      reply
                    </button>

                    <button onClick={() => handleViewreply(item.id)}>
                      {replydata[item.id]?.length || 0} view replies
                    </button>
                  </div>

                  {/* input */}
                  {replyInput[item.id] && (
                    <div className="ml-12 mt-2 flex space-x-2">
                      <input
                        value={replyText[item.id] || ""}
                        onChange={(e) =>
                          setreplyText(prev => ({
                            ...prev,
                            [item.id]: e.target.value
                          }))
                        }
                        className="border p-1 rounded w-full"
                        placeholder="اكتب رد..."
                      />
                      <button onClick={() => handlesendreply(item.id)}>
                        ارسال
                      </button>
                    </div>
                  )}

                  {/* replies */}
                {viewreply[item.id] && (
  <div className="ml-12 border-l pl-3 mt-2 space-y-3">
    {renderReplies(item.id)}
  </div>
)}</div></div>   ))  )}</div>
      </motion.div>
    </>
  );
};

export default SidebarPanel;
