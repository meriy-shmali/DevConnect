import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost, deletePost } from '@/api/PostApi'; 
import { toast } from 'react-hot-toast';
import i18next from 'i18next';

export const usePostActions = () => {
  const queryClient = useQueryClient();

  // helper: يحدّث البوستات في كل الـ caches (profile + feed + post single)
  const updateAllCaches = (updaterFn) => {
    // 1. profile cache
    const profileQueries = queryClient.getQueriesData({ queryKey: ['profile'] });
    profileQueries.forEach(([queryKey, oldData]) => {
      if (!oldData) return;
      const postsKey = oldData.posts ? 'posts' : oldData.results ? 'results' : null;
      if (!postsKey) return;
      queryClient.setQueryData(queryKey, {
        ...oldData,
        [postsKey]: updaterFn(oldData[postsKey]),
      });
    });

    // 2. feed / posts list cache
    const feedQueries = queryClient.getQueriesData({ queryKey: ['posts'] });
    feedQueries.forEach(([queryKey, oldData]) => {
      if (!oldData) return;

      // infinite query (pages)
      if (oldData.pages) {
        queryClient.setQueryData(queryKey, {
          ...oldData,
          pages: oldData.pages.map((page) => {
            const postsKey = page.posts ? 'posts' : page.results ? 'results' : null;
            if (!postsKey) return page;
            return { ...page, [postsKey]: updaterFn(page[postsKey]) };
          }),
        });
        return;
      }

      // regular array
      const postsKey = oldData.posts ? 'posts' : oldData.results ? 'results' : null;
      if (postsKey) {
        queryClient.setQueryData(queryKey, {
          ...oldData,
          [postsKey]: updaterFn(oldData[postsKey]),
        });
      }
    });
  };

  // snapshot لكل الـ caches للـ rollback
  const takeSnapshots = () => [
    ...queryClient.getQueriesData({ queryKey: ['profile'] }),
    ...queryClient.getQueriesData({ queryKey: ['posts'] }),
  ];

  const restoreSnapshots = (snapshots) => {
    snapshots?.forEach(([queryKey, oldData]) => {
      queryClient.setQueryData(queryKey, oldData);
    });
  };

  // --- ميوتشن التعديل ---
  const updateMutation = useMutation({
    mutationFn: ({ postId, data }) => updatePost(postId, data),

    onMutate: async ({ postId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const snapshots = takeSnapshots();

      // تحديث optimistic - نحدّث فقط الحقول النصية الموجودة في data
      // (FormData مش قابلة للـ spread مباشرة، نتحقق منها)
      const plainData = data instanceof FormData
        ? {
            content: data.get('content') ?? undefined,
            code: data.get('code') ?? undefined,
          }
        : data;

      updateAllCaches((posts) =>
        posts.map((post) =>
          String(post.id) === String(postId)
            ? { ...post, ...plainData }
            : post
        )
      );

      // تحديث single post cache لو موجود
      const singlePostKey = ['post', String(postId)];
      const singlePost = queryClient.getQueryData(singlePostKey);
      if (singlePost) {
        queryClient.setQueryData(singlePostKey, { ...singlePost, ...plainData });
      }

      return { snapshots };
    },

    onSuccess: (_data, { postId }) => {
      toast.success(i18next.t('post_updated_success'));
      // نعمل invalidate في الخلفية بعد النجاح لمزامنة داتا السيرفر الحقيقية
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['post', String(postId)], refetchType: 'none' });
    },

    onError: (error, _variables, context) => {
      console.error("Update Error:", error);
      restoreSnapshots(context?.snapshots);
      toast.error(i18next.t('post_updated_failed'));
    },
  });

  // --- ميوتشن الحذف ---
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const snapshots = takeSnapshots();

      // حذف فوري من كل الـ caches
      updateAllCaches((posts) =>
        posts.filter((post) => String(post.id) !== String(postId))
      );

      // إزالة single post cache
      queryClient.removeQueries({ queryKey: ['post', String(postId)] });

      return { snapshots };
    },

    onSuccess: () => {
      toast.success(i18next.t('post_deleted_success'));
      // مزامنة في الخلفية
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'none' });
    },

    onError: (error, _postId, context) => {
      console.error("Delete Error:", error);
      restoreSnapshots(context?.snapshots);
      toast.error(i18next.t('post_deleted_failed'));
    },
  });

  return {
    updateMutation,
    deleteMutation,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};