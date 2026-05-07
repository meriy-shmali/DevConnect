import { useMutation } from '@tanstack/react-query';
import { changePasswordApi ,sendOtpApi, resetPasswordApi} from '@/api/ChangeApi';

export const useChangePasswordMutation = (form) => {
  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      alert('تمت العملية بنجاح');
      form.reset(); // مسح الحقول بعد النجاح
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
    }
  }})};
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (email) => {
      return sendOtpApi(email); // ✅ تأكد أن الاسم هنا يطابق الـ import أعلاه
    },
    onError: (error) => {
       console.error("Mutation Error:", error); // نصيحة: أضف هذا السطر لرؤية الخطأ الحقيقي
    }
  });
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data)=> resetPasswordApi(data),
    //onSuccess: () => toast.success("Password reset successfully!"),
   // onError: () => toast.error("Invalid OTP or error occurred"),
  });
};