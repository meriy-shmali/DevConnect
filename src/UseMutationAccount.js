// src/hook/UseMutationAccount.js
import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateusernamereq,  getaccountdatareq ,getSavedPostsApi} from "../api/Accountapi";
import { toast } from 'react-hot-toast';
import i18next from 'i18next';

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (username) => {
      // التحقق من القيود باستخدام الـ Regex
      const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
      
      if (!usernameRegex.test(username)) {
        // جلب رسالة الخطأ المترجمة للشروط
        const errorMsg = i18next.t('username_validation');
        toast.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
      }
      
      return updateusernamereq(username);
    },
    onMutate: () => {},
    onSuccess: (response) => {
      toast.success(i18next.t('update_success'));
      queryClient.invalidateQueries(['accountData']);
    },
    onError: (error) => {
      // التحقق مما إذا كان السيرفر يرجّح أن الاسم مأخوذ
      if (error.response?.status === 400 || error.message?.includes("taken")) {
        // جلب رسالة "الاسم مأخوذ" المترجمة
        toast.error(i18next.t('username_taken'));
      } else {
        toast.error(error.message || "Error");
      }
    },
  });
};
export const useGetAccountData = () => {
    return useQuery({
       queryKey:['accountData'],
        queryFn: getaccountdatareq,
      
    });
};

export const useGetSavedPosts = (page = 1) => {
    return useQuery({
        queryKey: ['savedPosts', page],
        queryFn: () => getSavedPostsApi(page),
    });
};