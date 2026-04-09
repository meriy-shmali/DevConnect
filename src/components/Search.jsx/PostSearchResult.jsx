// هذا المكون تستخدمينه في التاغات وفي المنشورات
const PostSearchResult = ({ item }) => (
  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-2 mb-2">
      <img src={item.user?.personal_photo_url} className="w-8 h-8 rounded-full" />
      <span className="font-bold text-sm">{item.user?.username}</span>
    </div>
    <p className="text-sm line-clamp-3">{item.content}</p>
  </div>
);
export default PostSearchResult;