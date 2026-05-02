import { motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { HiOutlineAdjustments } from "react-icons/hi";
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import {useCommentLogic} from "@/hook/CommentLogic";
import CommentItem from "./Sidepanel/CommentItem";
import HeaderPanel from "./Sidepanel/HeaderPanel";
import { FaRegCommentDots } from "react-icons/fa";
import { useEffect,useRef } from "react";
const SidebarPanel = ({title,icon,items,showFilter,onClose,type,sort,setSort,postId,setCommentCount}) => {
  const isComments = type === "comments";

const logic = useCommentLogic(
  isComments ? items : [],
  isComments ? postId : null,
   isComments ? setCommentCount : null 
);
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
    handleEditClick,resetCommentState
  } = logic;

  const { t } = useTranslation();
useEffect(() => {
  if (type !== "comments") {
     logic.resetCommentState();
  }
}, [type]);
const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showmenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setshowmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showmenu]);
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
        transition={{ type: "tween", duration: 0.2 }}
        className="sidebar fixed right-0 top-0 w-[470px] h-screen bg-white shadow-xl p-6 flex flex-col z-20 mt-16 rounded-bl-2xl rounded-tl-2xl overflow-scroll dark:bg-dark-post-background border border-white"
      >
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold dark:text-gray-50">{title}</h2>
            <p className="text-[25px] dark:text-gray-50">{icon}</p>
          </div>
          <IoIosClose onClick={onClose} className="text-4xl text-red-600" />
        </div>

        {/* filter */}
        {type === "comments" && showFilter &&items?.length>0 && (
          <div className="flex justify-end mr-1 "ref={menuRef} >
            <button className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-900/20 backdrop-blur-lg flex items-center justify-center" onClick={() => setshowmenu(prev => !prev)}>
              <HiOutlineAdjustments className="text-2xl hover:text-black dark:text-gray-50 relative z-10 " />
            </button>

            {showmenu && (
                <motion.div
                         initial={{ y: 0,x:0 }}
                      animate={{ y: 2 ,x:-2 }}
                      exit={{ y: 2 }}
                      transition={{ type:"tween" ,duration: 0.1 }}
                     className="absolute right-16 mt-6 bg-white shadow-md rounded-md p-2 flex flex-col z-50 border border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        >
               
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
              </motion.div>
            )}
          </div>
        )}

        {/* items */}
        <div className="flex-col space-y-4">
          {items.length === 0 ? (
            <div className=" flex flex-col  items-center justify-center  h-full text-gray-500 dark:text-gray-50 space-y-4 relative -bottom-48 text-3xl">
             <div> {type=='comments'?<FaRegCommentDots className="text-8xl"/>:<LiaUserAltSlashSolid className="text-8xl" />}</div>
             <div> {type=='comments'?(t('nocomments')):(t('noitems'))}</div>
            </div>
          ) : (
            items.map(item => (
              isComments?(
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
              />):
              <HeaderPanel user={item} type={type} />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SidebarPanel;