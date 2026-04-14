import { motion, AnimatePresence } from "framer-motion";

const AISidePanel = ({ open, onClose, children }) => {
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
           initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: "tween", duration: 0.3 }}
            className="sidebar fixed right-0 top-0 w-[450px] h-screen  bg-gradient-background z-50  shadow-xl p-6   mt-16 rounded-bl-2xl rounded-tl-2xl   border border-white"
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