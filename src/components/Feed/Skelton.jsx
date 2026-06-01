const InstagramSkeleton = () => {
  return (
    <div className="bg-gray-300 dark:bg-dark-post-background border border-gray-200 dark:border-0 mt-8 rounded-2xl p-4 md:p-5 w-full animate-pulse shadow-sm">

      {/* الهيدر */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-1.5" />
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
        </div>
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* النص */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>

      {/* الصورة */}
      <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />

      {/* التفاعلات */}
      <div className="flex items-center gap-2">
        <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex gap-1.5 ml-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-11 h-7 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default InstagramSkeleton