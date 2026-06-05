// src/hook/UseMutationAccount.js
import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateusernamereq,  getaccountdatareq ,getSavedPostsApi} from "../api/Accountapi";
import { toast } from 'react-hot-toast';
import i18next from 'i18next';

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateusernamereq,
        onMutate: () => {},
        onSuccess: (response) => {
          toast.success(i18next.t('update_success'));
          queryClient.invalidateQueries(['accountData']);
        },
       onError: (error) => {
  const status = error?.response?.status;
  const usernameError = error?.response?.data?.username?.[0] || '';

  if (status === 400) {
    if (usernameError.includes('already') || 
        usernameError.includes('taken') ||
        usernameError.includes('exists')) {
      toast.error(i18next.t('username_taken'));
    } else if (usernameError.includes('must start with letter')) {
      toast.error(i18next.t('username_invalid'));
    } else {
      toast.error(i18next.t('update_error'));
    }
  } else {
    toast.error(i18next.t('update_error'));
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