import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
const AISidePanel = ({ open, onClose, children }) => {
  const { i18n } = useTranslation();
const isRTL = i18n.language === "ar";
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* الخلفية (تسكر عند الضغط خارجو) */}
          <div
            className="fixed inset-0  z-40"
            onClick={onClose}
          />

          {/* الـ panel فوق CreatePost */}
          <motion.div
      initial={{ x: isRTL ? -400 : 400 }}
animate={{ x: 0 }}
exit={{ x: isRTL ? -400 : 400 }}
        transition={{ type: "tween", duration: 0.3 }}
            className="sidebar fixed end-0 -top-4 w-[33%] h-screen  bg-gradient-background z-50  shadow-xl p-6   mt-16 rounded-bl-2xl rounded-tl-2xl   border border-white"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISidePanel;