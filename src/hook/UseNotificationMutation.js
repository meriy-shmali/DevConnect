import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsReadReq, updateFcmTokenReq } from '../api/NotificationApi';

export const useNotificationMutation = () => {
  const queryClient = useQueryClient();

  // ميوتيشن تحديث حالة القراءة
  const markAsRead = useMutation({
    mutationFn: (id) => markAsReadReq(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unread-count']);
    }
  });

  // ميوتيشن إرسال توكن الجهاز
  const updateToken = useMutation({
    mutationFn: (token) => updateFcmTokenReq(token),
    onSuccess: () => console.log("Device Token Registered Successfully")
  });

  return { markAsRead, updateToken };
};