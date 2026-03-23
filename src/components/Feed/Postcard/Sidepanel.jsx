import { IoIosClose } from "react-icons/io";
import { motion,AnimatePresence } from 'framer-motion';
import { LiaUserAltSlashSolid } from "react-icons/lia";
const SidebarPanel = ({ title, icon, items, showFilter, onClose,type }) => {
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
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-[25px]">{icon}</p>
          </div>
          {showFilter && (
            <button className="px-3 py-1 bg-gray-200 rounded-md">فلترة</button>
          )}
          <IoIosClose onClick={onClose} className="text-4xl text-red-600" />
        </div>

        <div className="flex-col space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 mt-32 text-3xl">
              <div><LiaUserAltSlashSolid className="text-9xl" /></div>
              <p>No items</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                {item.avatar && <img src={item.avatar} className="w-10 h-10 rounded-full" />}
                <span className="font-semibold">{item.name || item.text}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};export default SidebarPanel