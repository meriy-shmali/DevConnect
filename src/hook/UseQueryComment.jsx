import { useQuery } from "@tanstack/react-query";
import { commentgetreplies, getcomment } from "@/api/Commentapi";
export const usecomment = (postId, sort) => {
  const query = useQuery({
    queryKey: ['comment', postId, sort],
    queryFn: () => getcomment(postId, sort),
    enabled: !!postId
  });

  return query.data?.data || [];
};
//get replies
export const usegetreplies=(commentId,enabled)=>{
    return useQuery({
        queryKey:['replies',commentId],
        queryFn:()=>commentgetreplies(commentId),
        enabled:!!commentId&&enabled

    })
}