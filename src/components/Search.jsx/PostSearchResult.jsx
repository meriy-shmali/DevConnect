const PostSearchResult = ({ item }) => {
  const postImage = item.media && item.media.length > 0 
    ? (item.media[0].image_url || item.media[0].media_url || (typeof item.media[0] === 'string' ? item.media[0] : null))
    : null;

  return (
    // 💡 تم تقليل الـ padding إلى p-3 وتخفيف تدوير الحواف إلى rounded-xl ليتناسب مع صندوق البحث الضيق
    <div className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors w-full box-border">
      
      {/* هيدر المنشور - مرن */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <img 
          src={item.user?.personal_photo_url || '/default.jpg'} 
          className="w-7 h-7 rounded-full object-cover flex-shrink-0" 
          alt={item.user?.username}
        />
        <span className="font-medium text-xs md:text-sm dark:text-white truncate max-w-[120px] sm:max-w-none">
          {item.user?.username}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 ms-auto">
          {item.created_at && new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
      
      {/* محتوى المنشور - نص مرن يتقلص ذكياً بـ line-clamp */}
      <p className="text-xs md:text-sm line-clamp-2 mb-3 text-gray-700 dark:text-gray-300 break-words">
        {item.content}
      </p>

      {/* 💡 قسم الكود البرمجي المطور والمستجيب */}
      {item.code && (
        // تم تغيير overflow-hidden إلى overflow-auto وتحديد max-h بدلاً من الارتفاع الثابت
        <div className="mb-2 p-2.5 w-full max-h-32 bg-zinc-900 rounded-lg overflow-auto custom-scrollbar border border-zinc-800">
          {/* dir="ltr" إجباري للأكواد البرمجية حتى لو كان الموقع عربي، لمنع تبعثر الرموز */}
          <pre className="text-[11px] text-emerald-400 font-mono scroll-smooth" dir="ltr">
            <code>{item.code}</code>
          </pre>
        </div>
      )}

      {/* 💡 قسم عرض الصور المستجيب */}
      {postImage && (
        // تم جعل الارتفاع الأقصى max-h-36 لضمان عدم ملء الشاشة بالكامل داخل الـ Dropdown
        <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 max-h-36 bg-zinc-950 flex items-center justify-center">
          <img 
            src={postImage} 
            alt="post content" 
            className="w-full h-full object-contain max-h-36" 
          />
        </div>
      )}

      {/* التاغات */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {item.tags.map((tag, i) => (
            <span key={i} className="text-[11px] md:text-xs text-blue-500 dark:text-blue-400 font-medium hover:underline cursor-pointer">
              #{typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostSearchResult;