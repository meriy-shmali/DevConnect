import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CustomTooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.20 }}
            className="absolute bottom-full mb-3 px-3 py-1.5 bg-gray-50  text-black  text-sm  rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
          >
            {text}
            {/* السهم الصغير */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-50 "></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CustomTooltip