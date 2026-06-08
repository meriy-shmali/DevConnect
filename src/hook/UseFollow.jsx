import { follow, unfollow } from "@/api/Follow";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = () => {
  const queryClient = useQueryClient();

  // ─── Helper: عدّل is_following بجميع الـ queries المخزنة ───────────────────
  const updateFollowingInCache = (userId, isFollowing) => {
    ["suggestion", "post", "profile"].forEach((key) => {
      queryClient.setQueriesData({ queryKey: [key] }, (oldData) => {
        if (!oldData) return oldData;

        // ── بيانات Profile (object مباشر) ──────────────────────────────────
        if (oldData?.id && String(oldData.id) === String(userId)) {
          return { ...oldData, is_following: isFollowing };
        }
        if (oldData?.data?.id && String(oldData.data.id) === String(userId)) {
          return { ...oldData, data: { ...oldData.data, is_following: isFollowing } };
        }

        // ── بيانات مقسّمة بـ pages (infinite query) ────────────────────────
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              results: page.results?.map((item) => {
                // post له user بداخله
                if (item?.user?.id && String(item.user.id) === String(userId)) {
                  return { ...item, is_following: isFollowing };
                }
                // suggestion: المستخدم نفسه هو الـ item
                if (item?.id && String(item.id) === String(userId)) {
                  return { ...item, is_following: isFollowing };
                }
                return item;
              }),
            })),
          };
        }

        // ── بيانات عادية results بدون pages ────────────────────────────────
        if (Array.isArray(oldData?.results)) {
          return {
            ...oldData,
            results: oldData.results.map((item) => {
              if (item?.user?.id && String(item.user.id) === String(userId)) {
                return { ...item, is_following: isFollowing };
              }
              if (item?.id && String(item.id) === String(userId)) {
                return { ...item, is_following: isFollowing };
              }
              return item;
            }),
          };
        }

        return oldData;
      });
    });
  };

  // ─── Follow ────────────────────────────────────────────────────────────────
  const followMutation = useMutation({
    mutationFn: follow,

    onMutate: async (userId) => {
      // أوقف أي refetch جاري لتجنّب تضارب البيانات
      await Promise.all(
        ["suggestion", "post", "profile"].map((key) =>
          queryClient.cancelQueries({ queryKey: [key] })
        )
      );

      // احفظ snapshot للرجوع إليه لو فشل الطلب
      const snapshots = ["suggestion", "post", "profile"].map((key) => ({
        key,
        data: queryClient.getQueriesData({ queryKey: [key] }),
      }));

      // عدّل الـ cache فوراً
      updateFollowingInCache(userId, true);

      return { snapshots, userId };
    },

    onError: (_err, _userId, context) => {
      // ارجع للبيانات القديمة لو فشل الطلب
      context?.snapshots?.forEach(({ key, data }) => {
        data.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value);
        });
      });
    },

    onSettled: () => {
      ["suggestion", "post", "profile"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  // ─── Unfollow ──────────────────────────────────────────────────────────────
  const unfollowMutation = useMutation({
    mutationFn: unfollow,

    onMutate: async (userId) => {
      await Promise.all(
        ["suggestion", "post", "profile"].map((key) =>
          queryClient.cancelQueries({ queryKey: [key] })
        )
      );

      const snapshots = ["suggestion", "post", "profile"].map((key) => ({
        key,
        data: queryClient.getQueriesData({ queryKey: [key] }),
      }));

      updateFollowingInCache(userId, false);

      return { snapshots, userId };
    },

    onError: (_err, _userId, context) => {
      context?.snapshots?.forEach(({ key, data }) => {
        data.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value);
        });
      });
    },

    onSettled: () => {
      ["suggestion", "post", "profile"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return { followMutation, unfollowMutation };
};
