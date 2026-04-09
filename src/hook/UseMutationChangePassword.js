import { useMutation } from '@tanstack/react-query';
import { changePasswordApi } from '@/api/ChangeApi';

export const useChangePasswordMutation = (form) => {
  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      alert('تمت العملية بنجاح');
      form.reset(); // مسح الحقول بعد النجاح
    },
    onError: (error) => {
      const serverErrors = error.response?.data?.errors; // هيكلة الأخطاء المتوقعة من لارافيل أو نود
      
      if (serverErrors) {
        // نمر على كل خطأ قادم من الباك اند ونضعه تحت الحقل المناسب
        Object.keys(serverErrors).forEach((key) => {
          // نربط اسم الحقل في الباك اند باسم الحقل في الفورم عندك
          const fieldName = key === 'current_password' ? 'password' : 
                            key === 'new_password' ? 'newpassword' : 
                            key === 'new_password_confirmation' ? 'confirmpassword' : key;
          
          form.setError(fieldName, {
            type: 'server',
            message: serverErrors[key][0], // نأخذ أول رسالة خطأ للحقل
          });
        });
      } else {
        alert('حدث خطأ غير متوقع');
      }
    }
  });
};