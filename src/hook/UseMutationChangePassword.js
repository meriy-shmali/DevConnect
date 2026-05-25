import { useMutation } from '@tanstack/react-query';
import { changePasswordApi ,sendOtpApi, resetPasswordApi} from '@/api/ChangeApi';
import { toast } from 'react-hot-toast';
import { useTranslation } from "react-i18next";
 
export const useChangePasswordMutation = (form) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: changePasswordApi,
     onSuccess: (data) => {
      // استخدام الطريقة الصحيحة لـ react-toastify
      toast.success(data?.message || t('password_change_success'));
      form.reset(); 
    },
    onError: (error) => {
      const backendErrors = error?.response?.data;
      if (backendErrors && typeof backendErrors === 'object') {
        Object.keys(backendErrors).forEach((field) => {
          let formFieldName = field;

          // تحويل أسماء حقول الباك إيند لتطابق أسماء حقولك في الفرونت إيند
          if (field === "new_password") formFieldName = "newpassword";
          if (field === "confirm_new_password") formFieldName = "confirmpassword";
          if (field === "old_password") formFieldName = "password";

          form.setError(formFieldName, {
            type: "server",
            message: Array.isArray(backendErrors[field]) 
              ? backendErrors[field][0] 
              : backendErrors[field],
        });
        });
        
          toast.error(t('please_fix_errors'));
      } else {
        toast.error(t('unexpected_error'));
      }
    }
  });
};
export const useSendOtp = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (email) => sendOtpApi(email),
   onSuccess: (data) => {
      toast.success(data?.message || t('otp_sent_success'));
    },
    onError: (error) => {
      const backendError = error?.response?.data?.error;
      toast.error(backendError || t('otp_send_failed'));
    }
  });
};
export const useResetPassword = () => {
  const { t } = useTranslation();
 return useMutation({
    mutationFn: (data) => resetPasswordApi(data),
    onSuccess: (data) => {
      toast.success(data?.message ||  t('password_change_success'));
    },
    onError: () => {}
  });
};