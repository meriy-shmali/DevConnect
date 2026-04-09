import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import changepasswordschema from '../Schema/ChangePasswordSchema';
import { useSendOtp, useResetPassword } from "@/hook/UseMutationAccount";
import { Input } from "../ui/input"; 
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; 
export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const sendOtp = useSendOtp();
  const resetPass = useResetPassword();
  
  // 2. تعريف السكيما بناءً على الخطوة الحالية بشكل صحيح
  const currentSchema = useMemo(()=>{
    const rawSchema = changepasswordschema?.shape?changepasswordschema:
    changepasswordschema?._def?.schema;
    const shape=rawSchema?.shape;
    if (!shape) return z.object({});
    if (step===1){
    return z.object({ email: shape.email }) }
    return z.object({ 
        otp: shape.otp, 
        newpassword: shape.newpassword, 
        confirmpassword: shape.confirmpassword 
      }).refine((data) => data.newpassword === data.confirmpassword, {
        message: "the password does not match", // يفضل استخدام t('password_mismatch')
        path: ["confirmpassword"],
      });},[step]);

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit", // أو "onChange" إذا أردت ظهور الخطأ فوراً أثناء الكتابة
    reValidateMode: "onChange",
    defaultValues: { email: "", otp: "", newpassword: "", confirmpassword: "" },
  });
  
  const onSubmit = async(e) => {
    if (e) e.preventDefault();
  const fields = step === 1 
    ? ["email"] 
    : ["otp", "newpassword", "confirmpassword"];
    const isValid = await form.trigger(fields);
    if (isValid){
      const values=form.getValues();
    if (step === 1) {
      sendOtp.mutate(values.email, {
        onSuccess: () => {
          setStep(2);
          setEmail(values.email);
          form.clearErrors(); // تصفير الحقول للخطوة التالية
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || "Email not found";
          form.setError("email", { type: "server", message: errorMessage });
        }
      });
    } else {
      resetPass.mutate({ ...values, email }, {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || "Invalid OTP";
          form.setError("otp", { type: "server", message: errorMessage });
        }
      });
    }}
  };
  if (!isOpen) return null;


 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black dark:hover:text-white">
          <X size={20} />
        </button>

          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {step === 1 ? (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1 overflow-hidden">
                    <FormLabel className="text-[30px] font-medium text-black">{t('enter your email')}:</FormLabel>
                    <FormControl>
                      <Input placeholder="" 
                         {...field} 
                          onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(field.name)}
                          }}
                          className=" 
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20" />
                    </FormControl>
                    <FormMessage className="  md:text-[18px] text-[18px]" />
                  </FormItem>
                )}
              />
               ) : (
              <>
                {/* حقل الـ OTP */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[30px] font-medium text-black">{t('enter code')}:</FormLabel>
                      <FormControl>
                        <Input placeholder="" 
                        {...field} 
                         onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(field.name)}
                          }}
                        className=" 
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20" />
                      </FormControl>
                      <FormMessage className="  md:text-[18px] text-[18px]" />
                    </FormItem>
                  )}
                />
                {/* حقل الباسورد الجديد */}
                <FormField
                  control={form.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[30px] font-medium text-black">{t('new password')}:</FormLabel>
                      <FormControl>
                       <Input placeholder=""
                        {...field} 
                         onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(field.name)}
                          }}
                        className=" 
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20" />
                      </FormControl>
                      <FormMessage className="  md:text-[18px] text-[18px]" />
                    </FormItem>
                  )}
                />
                {/* حقل التأكيد */}
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[30px] font-medium text-black">{t('confirm password')}:</FormLabel>
                      <FormControl>
                       <Input placeholder=""
                        {...field} 
                         onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(['newpassword','confirmpassword'])}
                          }}
                        className=" 
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20" />
                      </FormControl>
                      <FormMessage className="  md:text-[18px] text-[18px]" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-center mt-6">
              <Button 
                 type="button" // نجعله button عادي للتحكم بالضغط يدوياً
                 onClick={onSubmit}     
               className='w-1/2 hover:bg-blue-800 text-white rounded-sm 
                transition-colors bg-blue-button hover:bg-blue-700 text-text-button text-[22px] 
               !cursor-pointer '
               disabled={sendOtp.isPending || resetPass.isPending}
              >
                {step === 1 ? (sendOtp.isPending ? "sending..." : "send code") : "reset password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};