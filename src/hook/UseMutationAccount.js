// src/hook/UseMutationAccount.js
import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getaccountdatareq, updateaccountreq,logoutreq,sendotpreq,resetpasswordreq } from "@/api/Accountapi"; // استيراد الوظيفة بالاسم الجديد
import { email } from "zod";
import { languages } from "prismjs";
import { toast } from "react-toastify";
import { data } from "react-router";

export const useUpdateAccount = () => {
    return useMutation({
        mutationFn: updateaccountreq,
         onMutate:()=>{},
         onSuccess:(data)=>{console.log('Update successful',data)},
         onError:()=>{},
    });
};
export const useGetAccountData = () => {
    return useQuery({
       queryKey:['accountData'],
        queryFn: getaccountdatareq,
      
    });
};
export const useLogout = () => {
    const queryClient =useQueryClient();
    return useMutation({
        mutationFn:logoutreq,
         onMutate:()=>{},
         onSuccess:()=>{
            console.log('Logout successful');
            localStorage.clear();
            window.location.href='/login';
         },
         onError:()=>{},
    });
};
export const useSendOtp = () => {
  return useMutation({
    mutationFn:(email)=> sendotpreq(email),
    onSuccess: () => toast.success("OTP sent to your email!"),
    onError: () => {},
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data)=>resetpasswordreq(data),
    onSuccess: () => toast.success("Password reset successfully!"),
    onError: () => toast.error("Invalid OTP or error occurred"),
  });
};