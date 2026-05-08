// هذا المكون تستخدمينه في التاغات وفي المنشورات
const PostSearchResult = ({ item }) => (
  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-2">
      <img 
        src={item.user?.personal_photo_url || '/default-avatar.png'} 
        className="w-8 h-8 rounded-full object-cover" 
      />
      <span className="font-bold text-sm dark:text-white">{item.user?.username}</span>
      <span className="text-xs text-gray-500">
        {item.created_at && new Date(item.created_at).toLocaleDateString()}
      </span>
    </div>
    
    <p className="text-sm line-clamp-3 mb-2 dark:text-gray-300">{item.content}</p>

    {/* إظهار التاغات كما في البوستمان */}
    {item.tags && item.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-2">
        {item.tags.map((tag, i) => (
          <span key={i} className="text-xs text-blue-500 font-medium">
            #{typeof tag === 'string' ? tag : tag.name}
          </span>
        ))}
      </div>
    )}

    {/* إظهار لغة البرمجة إذا وجدت */}
    {item.code_language && (
      <span className="text-[10px] bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
        {item.code_language}
      </span>
    )}
  </div>
);
export default  PostSearchResult;