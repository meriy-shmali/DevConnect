import { useQuery } from "@tanstack/react-query";
import { commentgetreplies, getcomment } from "@/api/Commentapi";
export const usecomment = (postId, sort) => {
  const query = useQuery({
    queryKey: ['comment', postId, sort],
    queryFn: () => getcomment(postId, sort),
    enabled: !!postId
  });
  console.log("البيانات الخام من الأكسيوس:", query.data);
const comments = Array.isArray(query.data?.data) ? query.data.data : (Array.isArray(query.data) ? query.data : [])
  return comments.map(c => ({
    id: c.id,
    user_id: c.user_id,
    content: c.content, // اجعلها content لتبقى متوافقة مع الـ Logic
    created_at: c.created_at,
    // لا تضعهم داخل object اسمه user لأن HeaderPanel يتوقعهم مباشرة من الـ item
    user_username: c.user_username, 
    user_photo_url: c.user_photo_url,
    likes: c.useful_count,
    dislikes: c.not_useful_count,
    replies_count: c.replies_count,
    is_reply: c.is_reply
  }));

};
//get replies
export const usegetreplies=(commentId,enabled)=>{
    return useQuery({
        queryKey:['replies',commentId],
        queryFn: async () => {
      const res = await commentgetreplies(commentId);
      return res.data.map(r => ({
       ...r, 
        likes: r.useful_count, 
        dislikes: r.not_useful_count,
        replies_count: r.replies_count
      }));
    },
    enabled: !!commentId && enabled,
    refetchOnMount: true,
  });
    
}