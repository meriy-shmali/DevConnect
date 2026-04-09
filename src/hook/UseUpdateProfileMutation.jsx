import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfilereq } from '../api/profileApi'; // تأكد من المسار الصحيح
//import { toast } from 'react-hot-toast'; // أو أي مكتبة تنبيهات تستخدمها

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => updateProfilereq(formData),
    onSuccess: (response) => {
      // تحديث بيانات المستخدم في الكاش لكي تظهر التعديلات فوراً في البروفايل
      queryClient.invalidateQueries(['user-profile']); 
     // toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
     // toast.error(errorMessage);
    },
    onSettled:()=>{}
  });
};