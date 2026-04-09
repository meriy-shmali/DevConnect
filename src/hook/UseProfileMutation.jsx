import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfilereq } from "../api/profileApi";
//import { toast } from "react-hot-toast";

export const useUpdatePersonalInfo = (username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (FormData)=>updateProfilereq(FormData),
    onMutate: () => {
      // منطق قبل البدء (مثلاً إظهار مؤشر تحميل)
    },
    onSuccess: () => {
      // إعادة جلب البيانات لتحديث الواجهة فوراً
      queryClient.invalidateQueries(["profile", username]);
     // toast.success("تم تحديث البيانات بنجاح");
    },
    onError: (error) => {
     // toast.error("حدث خطأ أثناء التحديث");
      console.error(error);
    },
  });
};