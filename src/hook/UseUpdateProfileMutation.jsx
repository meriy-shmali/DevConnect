import { useMutation, useQueryClient } from '@tanstack/react-query';
import {updateProfilereq, deleteProfilePhotoReq } from '@/api/ProfilePageApi'; // تأكد من المسار الصحيح
//import { toast } from 'react-hot-toast'; // أو أي مكتبة تنبيهات تستخدمها

export const useUpdateProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // استخدمي الدالة المستوردة مباشرة لأنها تحتوي على api.put والرابط الصحيح
    mutationFn: updateProfilereq, 
    onSuccess: () => {
       
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        console.log("تم تحديث الكاش بنجاح");
    },
    onError: (error) => {
      console.error("فشل التحديث:", error?.response?.data || error.message);
    }
  });
};
export const useDeleteProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfilePhotoReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("تم حذف الصورة وتحديث البيانات");
    }
  });
};