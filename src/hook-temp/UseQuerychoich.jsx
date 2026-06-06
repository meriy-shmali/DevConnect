import { useInfiniteQuery } from "@tanstack/react-query";
import { getchoichreq } from "@/api/Getchoichapi";

export const usechoich = (category) => {
  return useInfiniteQuery({
    queryKey: ["posts", category],
    queryFn: ({ pageParam = 1 }) => getchoichreq(category, pageParam),
    getNextPageParam: (lastPage) => {
      // إذا كان next يحتوي على رابط
      if (lastPage && lastPage.next) {
        try {
          const url = new URL(lastPage.next);
          const page = url.searchParams.get("page");
          return page ? Number(page) : undefined; // تحويل صريح لرقم
        } catch (e) {
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 0, // اجعليه 0 حالياً للتأكد من الجلب الجديد دائماً
    refetchOnWindowFocus: false,
  });
};