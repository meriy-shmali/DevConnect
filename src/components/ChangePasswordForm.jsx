// src/components/ChangePasswordForm.jsx

import React, { useState } from 'react';

// المكون الرئيسي للنموذج
const ChangePasswordForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تحديث حالة المدخلات
  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
    setError(''); // مسح الأخطاء عند الكتابة
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const { currentPassword, newPassword, confirmPassword } = passwords;

    // 1. التحقق من صحة المدخلات في الواجهة الأمامية (Client-side Validation)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('الرجاء تعبئة جميع الحقول.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقان.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.');
      setIsSubmitting(false);
      return;
    }
    
    // ملاحظة: هنا يتم دمج منطق الباك-إند
    try {
      // 2. إرسال طلب إلى API لتغيير كلمة المرور
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // يمكن إضافة رمز مصادقة (Authorization Header) هنا
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('تم تغيير كلمة المرور بنجاح!');
        // مسح الحقول بعد النجاح
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        // التعامل مع أخطاء الباك-إند (مثل كلمة المرور الحالية غير صحيحة)
        const errorData = await response.json();
        setError(errorData.message || 'فشل تغيير كلمة المرور. الرجاء المحاولة مرة أخرى.');
      }
    } catch (err) {
        console.error('...',err)
      setError('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // مكون حقل الإدخال لتقليل التكرار
  const PasswordInput = ({ label, name, value, onChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-center mb-6">
      <label htmlFor={name} className="block text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">
        {label}:
      </label>
      <input
        type="password"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full sm:w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          change password
        </h1>

        <form onSubmit={handleSubmit}>
          
          <PasswordInput
            label="current password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
          />

          <PasswordInput
            label="new password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
          />

          <PasswordInput
            label="confirm password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
          />
          {/* رسائل الخطأ والنجاح */}
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm font-medium">
              ✅ {success}
            </div>
          )}

          {/* زر التغيير ورابط نسيت كلمة المرور */}
          <div className="flex flex-col items-start mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-6 rounded-md text-white font-semibold transition duration-150 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
            
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;