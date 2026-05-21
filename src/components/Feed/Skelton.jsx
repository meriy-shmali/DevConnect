const InstagramSkeleton = () => {
  return (
    <div className="bg-gray-300 border border-gray-300 rounded-xl p-4 mb-6 w-full animate-pulse">
      {/* الرأس: الصورة الشخصية والاسم */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div> {/* دائرة الصورة */}
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div> {/* اسم المستخدم */}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div> {/* الوقت */}
        </div>
      </div>

      {/* محتوى النص (المنشور) */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* منطقة الصورة الكبيرة (مثل إنستغرام) */}
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>

      {/* التفاعلات (أزرار Like, Comment) */}
      <div className="flex space-x-14">
        
<div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
        
      <div className=" flex flex-row space-x-3">  
        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
         <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
         </div>
      </div>
    </div>
  );
};
export default InstagramSkeleton