import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onMessageListener } from "../firebase/firebaseConfig";
import { useNotificationMutation } from "./UseNotificationMutation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
export const useNotificationLogic = () => {
     const navigate = useNavigate();
     const { markAsRead } = useNotificationMutation();
     const queryClient = useQueryClient();
     useEffect(() => {
    onMessageListener()
      .then((payload) => {
        const title = payload.notification?.title || "DevConnect";
        const body = payload.notification?.body || "لديك تنبيه جديد";

        toast.info(`${title}: ${body}`, {
          position: "top-right",
          onClick: () => {
            const targetId = payload.data?.target_id;
            const targetType = payload.data?.target_type;
            
            // التوجيه باستخدام navigate (يعمل هنا بسلاسة)
            if (targetType === "follow") {
              navigate(`/profile/${targetId}`);
            } else {
              navigate(`/posts/${targetId}`);
            }
          },
        });

        // تحديث العداد تلقائياً عند وصول إشعار جديد
        queryClient.invalidateQueries(["unread-count"]);
      })
      .catch((err) => console.log("Foreground notification error:", err));
  }, [navigate, queryClient]);
  
     const handleItemClick = async (item) => {
    // 1. تحديث حالة القراءة في السيرفر
    if (!item.is_read) {
      await markAsRead.mutateAsync(item.id);
      
      // تحديث العداد محلياً فوراً (Optimistic Update)
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

    // 2. منطق الانتقال (Navigation Logic)
    const { notification_type, target_id, from_user,post_id,comment_id } = item;
    
    // الحالة الأولى: إذا كان نوع الإشعار "متابعة"
    if (notification_type === 'follow') {
      navigate(`/profile/${from_user?.id}`);
    } 
    
    // الحالة الثانية: إذا كان الإشعار (لايك بوست، لايك كومنت، كومنت جديد، رد على كومنت)
    // جميع هذه الحالات في كود ريتا مرتبطة بمنشور ولها target_id (معرف البوست)
    else  {
       const finalPostId = post_id || target_id;
    
    if (finalPostId) {
      // نرسل الـ comment_id داخل الـ state ليتم التقاطه في صفحة الـ PostPage
      navigate(`/posts/${finalPostId}`, { 
        state: { scrollToComment: comment_id || target_id } 
      });
      // ننتقل لصفحة البوست باستخدام المعرف القادم من الباك إند
      
    }
  };}

  return { handleItemClick };
};