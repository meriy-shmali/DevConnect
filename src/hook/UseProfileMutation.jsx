import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileInfo } from '@/api/ProfilePageApi';
import { toast } from 'react-toastify';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: (updatedData) => {
      // 1. تحديث بيانات البروفايل في الكاش فوراً
      // تأكدي أن 'profile' هو نفس المفتاح (Query Key) المستخدم في صفحة ProfilePage
     queryClient.setQueryData(['profile', 'me'], updatedData);
  
  // إجبار النظام على إعادة جلب البيانات لهذا المفتاح
  queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });

      toast.success("تم تحديث البيانات بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء التحديث");
      console.error(error);
    }
  });
};
