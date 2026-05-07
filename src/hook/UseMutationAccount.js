// src/hook/UseMutationAccount.js
import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateusernamereq,  getaccountdatareq } from "../api/Accountapi";
import { email } from "zod";
import { languages } from "prismjs";
import { toast } from 'react-hot-toast'
import { data } from "react-router";

export const useUpdateAccount = () => {
  const queryClient =useQueryClient();
    return useMutation({
        mutationFn: updateusernamereq,
         onMutate:()=>{},
         onSuccess: (response) => {
         const successMsg = response?.data?.message ;
         toast.success(successMsg);

         queryClient.invalidateQueries(['accountData']);toast.success("تم تحديث اسم المستخدم بنجاح!");},
         
         onError: (error) => {
            console.error("Update error:", error);
            alert("فشل التحديث: " + (error.response?.data?.message || "خطأ غير معروف"));
        },
    });
};
export const useGetAccountData = () => {
    return useQuery({
       queryKey:['accountData'],
        queryFn: getaccountdatareq,
      
    });
};

