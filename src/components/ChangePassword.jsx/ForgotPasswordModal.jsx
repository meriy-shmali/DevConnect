import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import changepasswordschema from '../Schema/ChangePasswordSchema';
import { useSendOtp, useResetPassword } from "@/hook/UseMutationChangePassword";
import { Input } from "../ui/input"; 
import { Button } from "../ui/button";
import { X,Eye,EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; 
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const sendOtp = useSendOtp();
  const resetPass = useResetPassword();
  const [showpassword,setShowPassword] = useState({
      new:false,
      confirm:false,
    });
  const toggleVisibility=(field)=>{
      setShowPassword(prev => ({
        ...prev,[field]:!prev[field]
      }));
    }
  // 2. تعريف السكيما بناءً على الخطوة الحالية بشكل صحيح
  const currentSchema = useMemo(()=>{
    const translatedSchema = changepasswordschema(t); 
    const rawSchema = translatedSchema?.shape?translatedSchema:
    translatedSchema?._def?.schema;
    const shape=rawSchema?.shape;
    if (!shape) return z.object({});
    if (step===1){
    return z.object({ email: shape.email }) }
    return z.object({ 
        otp: shape.otp, 
        newpassword: shape.newpassword, 
        confirmpassword: shape.confirmpassword 
      }).refine((data) => data.newpassword === data.confirmpassword, {
        message: t('password_mismatch'), 
        path: ["confirmpassword"],
      });},[step,t]);

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit", 
    reValidateMode: "onChange",
    defaultValues: { email: "", otp: "", newpassword: "", confirmpassword: "" },
  });
  
  const onSubmit = async () => {
  // 1. تحديد الحقول المراد فحصها يدوياً
  const fields = step === 1 ? ["email"] : ["otp", "newpassword", "confirmpassword"];
  
  // 2. تفعيل التحقق من صحة البيانات (Zod)
  const isValid = await form.trigger(fields);
  
  if (isValid) {
    const values = form.getValues();
     if (step === 1) {
        sendOtp.mutate(values.email, {
          onSuccess: () => {
            setStep(2);
            setEmail(values.email);
            form.clearErrors();
          },
          onError: (error) => {
            const errorMessage = error?.response?.data?.message || t("Email not found");
            form.setError("email", { type: "server", message: errorMessage });
          },
        });
      } else {
        resetPass.mutate({ ...values, email }, {
          onSuccess: () => {
            onClose();
          },
         onError: (error) => {
  const backendErrors = error?.response?.data;
  if (backendErrors && backendErrors.error) {
            form.setError("otp", {
              type: "server",
              message: backendErrors.error // سيأخذ نص "Invalid code." مباشرة ويضعه تحت حقل الـ OTP
            });
          }

  else if (backendErrors && typeof backendErrors === 'object' && !backendErrors.message) {
    // نمر على كل الأخطاء القادمة (سواء كانت واحداً أو أكثر)
    Object.keys(backendErrors).forEach((field) => {
      let formFieldName = field;
      if (field === "old_password") formFieldName = "password"; 
      if (field === "new_password") formFieldName = "newpassword";
      if (field === "confirm_new_password") formFieldName = "confirmpassword";

      form.setError(formFieldName, {
        type: "server",
        // الباك قد يرسل مصفوفة أخطاء [ "error 1", "error 2" ]
        message: Array.isArray(backendErrors[field]) 
          ? backendErrors[field][0] 
          : backendErrors[field],
                });
              });
            } else {
              const errorMessage = backendErrors?.message || backendErrors || t("error_occurred");
              form.setError("otp", { type: "server", message: errorMessage });
            }
          },
        });
      }
    } else {
      console.log("Zod Validation Failed", form.formState.errors);
    }
  };

  if (!isOpen) return null;


 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4">
      <div className="bg-white  dark:bg-dark-post-background w-full max-w-md rounded-xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute end-4 top-4 text-gray-400 hover:text-black dark:hover:text-white">
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
                    <FormLabel className="text-[30px] font-medium text-black dark:text-gray-50">{t('enter_your_email')}:</FormLabel>
                    <FormControl>
                      <Input placeholder="" 
                         {...field} 
                          onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(field.name)}
                          }}
                          className=" hover:bg-hover-placeholder bg-light-placeholder shadow  rounded-2xl
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide dark:text-gray-50
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20"
                          />
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
                      <FormLabel className="text-[30px] font-medium text-black dark:text-gray-50">{t('enter_code')}:</FormLabel>
                      <FormControl>
                        <Input placeholder="" 
                        {...field} 
                         onChange={(e)=>{field.onChange(e);
                            if (form.formState.errors[field.name]){
                            form.trigger(field.name)}
                          }}
                        className=" hover:bg-hover-placeholder bg-light-placeholder shadow  rounded-2xl
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide dark:text-gray-50
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
                    <FormItem className='flex flex-col space-y-1'>
                     <FormLabel className="text-[30px] font-medium text-black dark:text-gray-50">{t('new_password')}:</FormLabel>
                      <div className='flex flex-col w-full max-w-[500px]  translate-y-1 md:translate-y-2'>
                       <FormControl>
                        <InputGroup className=" hover:bg-hover-placeholder bg-light-placeholder shadow  rounded-2xl
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide dark:text-gray-50
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20">
                        <InputGroupInput
                          {...field}
                          onChange={(e)=>{field.onChange(e);
                            if (form.getValues('confirmpassword')){
                            form.trigger(['newpassword,confirmpassword'])}
                          }}
                           type={showpassword.new ? 'text' : 'password'}
                           placeholder=""
                           className="flex-shrink-0 md:text-[22px] text-[22px] dark:text-gray-50 whitespace-nowrap overflow-x-auto
                                      overflow-y-hidden scrollbar-hide"
                        />
                        <button
                         type='button'
                         onClick={()=>toggleVisibility('new')}
                         className='outline-none focus:outline-none group-focus-within:text-blue-button hover:opacity-70 transition-color'>
                          {showpassword.new ? (
                           <EyeOff className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                             ):(
                           <Eye className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                               )
                          }
                        </button>
                      </InputGroup>
                   </FormControl>
                   <div className='  w-full mb-1 '>
                 <FormMessage className="   md:text-[20px] text-[20px] " />
                </div></div>
               </FormItem>
                  )}
                />
                {/* حقل التأكيد */}
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                     <FormItem className='flex flex-col  space-y-1'>
                      <FormLabel className="text-[30px] font-medium text-black dark:text-gray-50">{t('confirm_password')} </FormLabel>
                        <div className='flex flex-col w-full max-w-[500px]  translate-y-1 md:translate-y-2'>
                         <FormControl>
                           <InputGroup className=" hover:bg-hover-placeholder bg-light-placeholder shadow  rounded-2xl
                         md:text-[18px] text-[18px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                         overflow-y-hidden scrollbar-hide dark:text-gray-50
                         group bg-white border-black border w-full px-3 max-w-[500px] h-[46px] mb-1
                         focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
                         focus-within: outline-none dark:bg-dark-post-background dark:border-white/20">
                            <InputGroupInput
                              {...field}
                             onChange={(e)=>{field.onChange(e);
                              if (form.formState.errors[field.name]){
                               form.trigger(['newpassword','confirmpassword'])}
                               }}
                              type={showpassword.confirm ? 'text' : 'password'}
                              placeholder=""
                              className=" flex-shrink-0 md:text-[22px] text-[22px] dark:text-gray-50 whitespace-nowrap overflow-x-auto
                                          overflow-y-hidden scrollbar-hide"
                            />
                             <button
                               type='button'
                               onClick={()=>toggleVisibility('confirm')}
                               className='outline-none focus:outline-none  hover:opacity-70 transition-color'>
                                {showpassword.confirm ? (
                                  <EyeOff className='size-6 text-black  dark:text-gray-50'/>
                                    ):(
                                  <Eye className='size-6 text-black  dark:text-gray-50'/>
                                      )
                                }
                              </button>
                             </InputGroup>
                          </FormControl>
                        <div className='  w-full mb-1 '>
                      <FormMessage className="   md:text-[20px] text-[20px] " />
                   </div></div>
                 </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-center mt-6">
              <Button 
                 type="button" // نجعله button عادي للتحكم بالضغط يدوياً
                 onClick={onSubmit}     
               className='md:w-3/5 hover:bg-blue-800 text-white rounded-sm 
                transition-colors bg-blue-button hover:bg-blue-700 text-text-button text-[22px] 
               !cursor-pointer '
               disabled={sendOtp.isPending || resetPass.isPending}
              >
                {step === 1 ? (sendOtp.isPending ? t('sending') : t('send_code')) :  t('reset_password')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};