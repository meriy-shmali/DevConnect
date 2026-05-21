// src/hook/UseMutationAccount.js
import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateusernamereq,  getaccountdatareq ,getSavedPostsApi} from "../api/Accountapi";
import { toast } from 'react-hot-toast'
import i18next from 'i18next';

export const useUpdateAccount = () => {
  const queryClient =useQueryClient();
    return useMutation({
        mutationFn: updateusernamereq,
         onMutate:()=>{},
           onSuccess: (response) => {
          toast.success(i18next.t('update_success'));
          queryClient.invalidateQueries(['accountData']);
          },
         onError: () => {},
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