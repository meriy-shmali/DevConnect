// هذا المكون تستخدمينه في التاغات وفي المنشورات
const PostSearchResult = ({ item }) => {
     const postImage = item.media && item.media.length > 0 
    ? (item.media[0].image_url || item.media[0].media_url || (typeof item.media[0] === 'string' ? item.media[0] : null))
    : null;
return (
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

   {/* عرض الكود البرمجي إذا وجد */}
    {item.code && (
      <div className="mb-3 p-3 w-full h-40  bg-zinc-900 rounded-lg overflow-hidden">
        <pre className="text-[10px] text-blue-400 font-mono ">
          <code>{item.code}</code>
        </pre>
      </div>
    )}

    {/* عرض الصور إذا وجدت */}
    { postImage && (
      <div className="mb-3 rounded-xl overflow-hidden border dark:border-zinc-700">
        <img src={ postImage} alt="post content" className="w-full h-40 object-cover" />
      </div>
    )}

    {/* التاغات */}
    {item.tags && item.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, i) => (
          <span key={i} className="text-xs text-blue-500 font-semibold hover:underline">
            #{typeof tag === 'string' ? tag : tag.name}
          </span>
        ))}
      </div>
    )}
  </div>
)};
export default  PostSearchResult;