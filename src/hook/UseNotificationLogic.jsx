import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onMessageListener } from "../firebase/firebaseConfig";
import { useNotificationMutation } from "./UseNotificationMutation";
import { toast } from 'react-hot-toast';
import { useQueryClient } from "@tanstack/react-query";

// ✅ استقبال onClose لإغلاق الـ sidebar قبل الانتقال
export const useNotificationLogic = (onClose) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotificationMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        const title = payload.notification?.title || "DevConnect";
        const body = payload.notification?.body;

        toast.info(`${title}: ${body}`, {
          position: "top-right",
          onClick: () => {
            const targetId = payload.data?.target_id;
            const targetType = payload.data?.target_type;

            if (targetType === "follow") {
              navigate(`/profile/${targetId}`);
            } else {
              // ✅ نفس الـ route الصحيح /post/ بدون s
              navigate(`/post/${targetId}`);
            }
          },
        });

        queryClient.invalidateQueries(["unread-count"]);
      })
      .catch((err) => console.log("Foreground notification error:", err));
  }, [navigate, queryClient]);

  const handleItemClick = async (item) => {
    // 1. أغلق الـ sidebar فوراً قبل أي شيء
    onClose?.();

    // 2. علّم الإشعار كمقروء
    if (!item.is_read) {
      await markAsRead.mutateAsync(item.id);

      queryClient.setQueryData(['unread-count'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            unread_count: Math.max(0, (oldData.data.unread_count || 0) - 1)
          }
        };
      });
    }

    // 3. منطق الانتقال
    const { notification_type, target_id, from_user, post_id, comment_id } = item;

    if (notification_type === 'follow') {
      navigate(`/profile/${from_user?.id}`);
    } else {
      const finalPostId = post_id || target_id;

      if (finalPostId) {
        // ✅ /post/ بدون s — نفس الـ route في PostPage.jsx
        navigate(`/post/${finalPostId}`, {
          state: { scrollToComment: comment_id || null }
        });
      }
    }
  };

  return { handleItemClick };
};
