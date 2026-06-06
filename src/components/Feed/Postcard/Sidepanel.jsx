import { motion } from "framer-motion";
import { X } from 'lucide-react';
import { HiOutlineAdjustments } from "react-icons/hi";
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { useCommentLogic } from "@/hook/CommentLogic";
import CommentItem from "./Sidepanel/CommentItem";
import HeaderPanel from "./Sidepanel/HeaderPanel";
import { FaRegCommentDots } from "react-icons/fa";
import { useEffect, useRef } from "react";

const SidebarPanel = ({ title, icon, items,highlightedCommentId, showFilter, onClose, type, sort, setSort, postId, setCommentCount, currentUser }) => {
  const isComments = type === "comments";

  const logic = useCommentLogic(
    isComments ? items : [],
    isComments ? postId : null,
    isComments ? setCommentCount : null 
  );
  
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  // 🌟 كود إضافي داخل SidebarPanel لفتح الردود تلقائياً إذا كان الإشعار لرد فرعي
  useEffect(() => {
    if (highlightedCommentId && isComments && items?.length > 0) {
      items.forEach(item => {
        const hasTargetReply = item.replies?.some(r => String(r.id) === String(highlightedCommentId));
        if (hasTargetReply && typeof logic.handleViewreply === 'function') {
          logic.handleViewreply(item.id);
        }
      });
    }
  }, [highlightedCommentId, items, isComments, logic]);
  const {
    showmenu,
    setshowmenu,
    handleTranslate,
    istranslate,
    translate,
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
    handleEditClick,
    resetCommentState,
    pendingTranslateId
  } = logic;

  useEffect(() => {
    if (type !== "comments") {
      logic.resetCommentState();
    }
  }, [type]);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // إغلاق الـ Sidebar عند النقر خارجه
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose(); 
      }

      // إغلاق قائمة الفلتر الصغيرة عند النقر خارجها
      if (showmenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setshowmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showmenu, onClose]); 

  return (
    <>
      {/* sidebar */}
      <motion.div
        ref={sidebarRef}
        key={type}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: isRTL ? -400 : 400 }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? -400 : 400 }}
        transition={{ type: "tween", duration: 0.2 }}
        className={`sidebar fixed end-0 top-0 md:-top-4 
          w-[70%] sm:w-[400px]  ${isRTL? "md:w-[33%]":"md:w-[30%]"} z-[10000]
          h-full md:h-screen 
          bg-white shadow-xl p-6 flex flex-col z-50 
          overflow-auto comment-scroll dark:bg-dark-post-background dark:border border-gray-700 
          md:mt-16 md:rounded-bl-2xl md:rounded-tl-2xl
          pb-10 md:pb-24`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="md:text-2xl text-xl font-bold dark:text-gray-50">{title}</h2>
            <p className="md:text-2xl text-xl dark:text-gray-50">{icon}</p>
          </div>
          <button onClick={onClose} className="absolute top-5 end-4 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-red-500 text-xl font-light hover:text-red-700 dark:text-red-700 " />
          </button>
        </div>

        {/* filter */}
        {type === "comments" && showFilter && items?.length > 0 && (
          <div className="flex justify-end " ref={menuRef} >
            <button className="me-1.5" onClick={() => setshowmenu(prev => !prev)}>
              <HiOutlineAdjustments className="md:text-xl text-lg hover:text-black dark:text-gray-50 relative start-2 z-10 " />
            </button>

            {showmenu && (
              <motion.div
                initial={{ y: 0, x: 0 }}
                animate={{ y: 2, x: -2 }}
                exit={{ y: 2 }}
                transition={{ type: "tween", duration: 0.1 }}
                className="absolute end-14 mt-6 bg-white shadow-md rounded-md p-2 flex flex-col z-50 border border-gray-300 dark:bg-navbar"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSort("latest");
                    setshowmenu(false);
                  }}
                  className="px-3 py-1 md:text-md text-sm hover:text-gray-600 dark:hover:text-gray-800"
                >
                  {t("latest")}
                </button>

                <button
                  onClick={() => {
                    setSort("oldest");
                    setshowmenu(false);
                  }}
                  className="px-1.5 py-1 md:text-md text-sm hover:text-gray-600 dark:hover:text-gray-800"
                >
                  {t("oldest")}
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* items */}
        <div className="flex-col md:space-y-4 ">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-50 space-y-4 relative top-[200%] md:top-[100%] md:text-3xl text-2xl">
              <div>{type == 'comments' ? <FaRegCommentDots className="md:text-6xl text-6xl" /> : <LiaUserAltSlashSolid className="md:text-7xl text-6xl" />}</div>
              <div>{type == 'comments' ? (t('nocomments')) : (t('noitems'))}</div>
            </div>
          ) : (
            items.map(item => (
              isComments ? (
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
                  pendingTranslateId={pendingTranslateId}
                  replydata={replydata}
                  replyInput={replyInput}
                  replyText={replyText}
                  setreplyText={setreplyText}
                  handlesendreply={handlesendreply}
                  viewreply={viewreply}
                  t={t}
                  highlightedCommentId={highlightedCommentId}
                />
              ) : (
                <HeaderPanel user={item} type={type} currentUserId={currentUser?.id} />
              )
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SidebarPanel;