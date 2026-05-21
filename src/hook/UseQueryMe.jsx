import { MeApi } from "@/api/Meapi";
import { useQuery } from "@tanstack/react-query";
export const UseMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await MeApi();
      return res.data; // سيعيد { "id": 3, "personal_photo_url": "..." }
    },
    // لإبقاء البيانات محفوظة وعدم طلبها مجدداً إلا عند تحديث الصفحة
    staleTime: Infinity, 
  });
};