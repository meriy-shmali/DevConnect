import { motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { HiOutlineAdjustments } from "react-icons/hi";
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import {useCommentLogic} from "@/hook/CommentLogic";
import CommentItem from "./Sidepanel/CommentItem";
const SidebarPanel = ({
  title,
  icon,
  items,
  showFilter,
  onClose,
  type,
  sort,
  setSort
}) => {
  const {
    showmenu,
    setshowmenu,
    handleTranslate,
    istranslate,
    translate,
    currentUser,
    menu,
    toggleMenu,
    handleReaction,
    counts,
    handleViewreply,
    handlesendreply,
    viewreply,
    replydata,
    replyText,
    setreplyText,
    handleReplyClick,
    replyInput,
    editing,
    handleDeleteComment,
    handleEditClick
  } = useCommentLogic(items);

  const { t } = useTranslation();

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} className="fixed inset-0 w-[800px] left-1/2" />

      {/* sidebar */}
      <motion.div
        key={type}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3 }}
        className="sidebar fixed right-0 top-2 w-[450px] h-screen bg-white shadow-lg p-4 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-scroll"
      >
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-[25px]">{icon}</p>
          </div>
          <IoIosClose onClick={onClose} className="text-4xl text-red-600" />
        </div>

        {/* filter */}
        {type === "comments" && showFilter && (
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
                  {t("latest")}
                </button>

                <button
                  onClick={() => {
                    setSort("oldest");
                    setshowmenu(false);
                  }}
                  className="px-3 py-1 hover:text-gray-600"
                >
                  {t("oldest")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* items */}
        <div className="flex-col space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 mt-16 text-xl">
              <LiaUserAltSlashSolid className="text-7xl" />
              <p>No items</p>
            </div>
          ) : (
            items.map(item => (
              <CommentItem
                key={item.id}
                item={item}
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
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SidebarPanel;