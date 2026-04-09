import { useNavigate } from "react-router";
import { useNotificationMutation } from "./UseNotificationMutation";

export const useNotificationLogic = () => {
     const navigate = useNavigate();
      const { markAsRead } = useNotificationMutation();
    
      const handleItemClick = (item) => {
        // 1. تحديث الحالة لمقروء في الباك إند
        if (!item.is_read) {
          markAsRead.mutate(item.id);
        }
    
        // 2. التوجيه الذكي (Routing) حسب الـ JSON اللي بعتيه
        const { target_type, target_id, post_id, from_user } = item;
    
        if (target_type === 'post') {
          navigate(`/post/${target_id || post_id}`);
        } else if (target_type === 'comment') {
          navigate(`/post/${post_id}`);
        } else if (target_type === 'profile') {
          navigate(`/profile/${from_user.username}`);
        }
    };
    return { handleItemClick };
}