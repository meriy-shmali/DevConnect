import { z } from 'zod';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import changepasswordschema from '../Schema/ChangePasswordSchema';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import Buttons from '../ui/ButtonGroup';
import { useChangePasswordMutation } from '@/hook/UseMutationChangePassword';
import { ForgotPasswordModal } from './ForgotPasswordModal';

const ChangeForm = () => {
  const { t } = useTranslation();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [showpassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev, [field]: !prev[field]
    }));
  };
    
  const currentSchema = useMemo(() => {
    const translatedSchema = changepasswordschema(t); 
    const rawSchema = translatedSchema?.shape ? translatedSchema : translatedSchema?._def?.schema;
    const shape = rawSchema?.shape;
    if (!shape) return z.object({});
    
    return z.object({ 
      password: shape.password, 
      newpassword: shape.newpassword, 
      confirmpassword: shape.confirmpassword 
    }).refine((data) => data.newpassword === data.confirmpassword, {
      message: t('password_mismatch'),
      path: ["confirmpassword"],
    });
  }, [t]);

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onSubmit',
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      newpassword: "",
      confirmpassword: "",
    },
  });
  
  const Values = form.watch();
  const hasData = Values.password.length > 0 || Values.newpassword.length > 0 || Values.confirmpassword.length > 0;
  
  const { mutate, isPending } = useChangePasswordMutation(form);
  const onSubmit = (Values) => { mutate(Values); };
   
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 text-black">

        {/* 1️⃣ حقل كلمة المرور الحالية */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:min-w-[300px] lg:min-w-[400px] flex-shrink-0 text-xl md:text-2xl">{t('current_password')}:</FormLabel>
              <div className='flex flex-col w-full max-w-[500px]'>
                <FormControl>
                  <InputGroup className="group hover:bg-hover-placeholder bg-light-placeholder shadow rounded-2xl bg-white border-black border w-full px-3 max-w-[500px] h-fit mb-4 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20">
                    <InputGroupInput
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (form.formState.errors[field.name]) {
                          form.trigger(field.name);
                        }
                      }}
                      type={showpassword.current ? 'text' : 'password'} // ✨ تم الإصلاح لـ current
                      placeholder=""
                      className="flex-shrink-0 md:text-[22px] text-[22px] dark:text-gray-50 "
                    />
                    <button
                      type='button'
                      onClick={() => toggleVisibility('current')} // ✨ تم الإصلاح لـ current
                      className='outline-none focus:outline-none group-focus-within:text-blue-button hover:opacity-70 transition-color'
                    >
                      {showpassword.current ? (
                        <EyeOff className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      ) : (
                        <Eye className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      )}
                    </button>
                  </InputGroup>
                </FormControl>
                <div className='w-full mb-1'>
                  <FormMessage className="md:text-[20px] text-[20px]" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* 2️⃣ حقل كلمة المرور الجديدة */}
        <FormField
          control={form.control}
          name="newpassword"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:min-w-[300px] lg:min-w-[400px] flex-shrink-0 text-xl md:text-2xl">{t('new_password')}:</FormLabel>
              <div className='flex flex-col w-full max-w-[500px]'>
                <FormControl>
                  <InputGroup className="group hover:bg-hover-placeholder bg-light-placeholder shadow rounded-2xl bg-white border-black border w-full px-3 max-w-[500px] h-fit mb-4 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20">
                    <InputGroupInput
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (form.getValues('confirmpassword')) {
                          form.trigger(['newpassword', 'confirmpassword']); // ✨ إصلاح دمج النص هنا داخل المصفوفة
                        }
                      }}
                      type={showpassword.new ? 'text' : 'password'}
                      placeholder=""
                      className="flex-shrink-0 md:text-[22px] text-[22px] dark:text-gray-50 "
                    />
                    <button
                      type='button'
                      onClick={() => toggleVisibility('new')}
                      className='outline-none focus:outline-none group-focus-within:text-blue-button hover:opacity-70 transition-color'
                    >
                      {showpassword.new ? (
                        <EyeOff className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      ) : (
                        <Eye className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      )}
                    </button>
                  </InputGroup>
                </FormControl>
                <div className='w-full mb-1'>
                  <FormMessage className="md:text-[20px] text-[20px]" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* 3️⃣ حقل تأكيد كلمة المرور */}
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:min-w-[300px] lg:min-w-[400px] flex-shrink-0 text-xl md:text-2xl">{t('confirm_password')} </FormLabel>
              <div className='flex flex-col w-full max-w-[500px]'>
                <FormControl>
                  <InputGroup className="group hover:bg-hover-placeholder bg-light-placeholder shadow rounded-2xl bg-white border-black border w-full px-3 max-w-[500px] h-fit mb-4 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20">
                    <InputGroupInput
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (form.formState.errors[field.name]) {
                          form.trigger(['newpassword', 'confirmpassword']);
                        }
                      }}
                      type={showpassword.confirm ? 'text' : 'password'}
                      placeholder=""
                      className="flex-shrink-0 md:text-[22px] text-[22px] dark:text-gray-50 "
                    />
                    <button
                      type='button'
                      onClick={() => toggleVisibility('confirm')}
                      className='outline-none focus:outline-none group-focus-within:text-blue-button hover:opacity-70 transition-color'
                    >
                      {showpassword.confirm ? (
                        <EyeOff className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      ) : (
                        <Eye className='size-6 text-black group-focus-within:text-blue-button dark:text-gray-50'/>
                      )}
                    </button>
                  </InputGroup>
                </FormControl>
                <div className='w-full mb-1'>
                  <FormMessage className="md:text-[20px] text-[20px]" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* زر الإرسال */}
        {hasData && (
          <div className='flex w-full  md:ps-[325px] lg:ps-[420px] transition-all duration-300 px-2 p-0 h-auto -ms-1 text-left items-start justify-start'>          
            <Buttons  
              className={`w-full md:h-[80px] bg-blue-button hover:bg-blue-700 text-text-button font-black h-[70px] text-3xl md:text-4xl !cursor-pointer ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              type="submit"
              disabled={isPending}
            />   
          </div>
        )} 

        {/* زر نسيت كلمة المرور */}
        <div className='w-full mt-8 px-0 flex justify-start'>  
          <Button
            variant='link' 
            onClick={(e) => {
              e.preventDefault();
              setIsForgotModalOpen(true);
            }}
            className='p-0 h-auto -ms-1 text-left items-start justify-start underline decoration-solid decoration-skip-ink-none underline-offset-9 text-xl md:text-xl text-blue-button hover:opacity-90  cursor-pointer'
          >
            {t('forgot_password')}
          </Button>
        </div>

        {/* المودال المستدعى */}
        {isForgotModalOpen && (
          <ForgotPasswordModal
            isOpen={isForgotModalOpen}
            onClose={() => setIsForgotModalOpen(false)}
          />
        )}
      </form>
    </Form>
  );
};

export default ChangeForm;

