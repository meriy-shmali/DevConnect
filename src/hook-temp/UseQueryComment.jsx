import { useQuery } from "@tanstack/react-query";
import { commentgetreplies, getcomment } from "@/api/Commentapi";
export const usecomment = (postId, sort) => {
  const query = useQuery({
    queryKey: ['comment', postId, sort],
    queryFn: () => getcomment(postId, sort),
    enabled: !!postId,
   staleTime: 1000 
  });
  console.log("البيانات الخام من الأكسيوس:", query.data);
const comments = Array.isArray(query.data?.data) ? query.data.data : (Array.isArray(query.data) ? query.data : [])
  return comments.map(c => ({
     id: c.id,
  user_id: c.user_id,
  content: c.content,
  created_at: c.created_at,
  user_username: c.user_username,
  user_photo_url: c.user_photo_url,
  likes: c.useful_count,       // ✅ موجود
  dislikes: c.not_useful_count, // ✅ موجود
  replies_count: c.replies_count,
  is_reply: c.is_reply,
  userReaction: c.user_reaction ?? null,
  }));

};
//get replies
export const usegetreplies = (commentId, enabled) => {
  return useQuery({
    queryKey: ['replies', commentId],
    queryFn: async () => {
      const res = await commentgetreplies(commentId);
      // ✅ تحقق من شكل الـ response
      const list = Array.isArray(res.data) ? res.data : 
                   Array.isArray(res.data?.data) ? res.data.data : [];
      return list.map(r => ({
        ...r,
        likes: r.useful_count ?? 0,
        dislikes: r.not_useful_count ?? 0,
        replies_count: r.replies_count ?? 0,
        user_id: r.user_id,
      }));
    },
    enabled: !!commentId && enabled,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
};