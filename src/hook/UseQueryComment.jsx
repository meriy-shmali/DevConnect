import { useQuery } from "@tanstack/react-query";
import { commentgetreplies, getcomment } from "@/api/Commentapi";
export const usecomment = (postId, sort) => {
  const query = useQuery({
    queryKey: ['comment', postId, sort],
    queryFn: () => getcomment(postId, sort),
    enabled: !!postId
  });
const comments = query.data?.data || [];
  return comments.map(c => ({
    id: c.id,
    text: c.content,
    createdAt: c.created_at,
    user: {
      username: c.user_username,
      personal_photo_url: c.user_photo_url
    },
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
        id: r.id,
        text: r.content,
        user: {
          username: r.user_username,
          personal_photo_url: r.user_photo_url
        },
        createdAt: r.created_at,
        likes: r.useful_count,
        dislikes: r.not_useful_count,
        replies_count: r.replies_count,
        isReply: r.is_reply
      }));
    },
    enabled: !!commentId && enabled
  });
    
}