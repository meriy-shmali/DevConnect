import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import registerschema from '../Schema/RegisterSchema';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MailIcon, LockIcon, User, Phone } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { useregister } from '@/hook/UseMutationRegister';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const registerMutation = useregister();
  const navigate = useNavigate();

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(registerschema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      age: "",
      gender: "",
      username: "",
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating account...");

    registerMutation.mutate(data, {
      onSuccess: (res) => {
        if (res.data?.access) {
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          toast.success(t('Register_success'), { id: toastId });
          navigate("/feed", { replace: true });
        } else {
          toast.success(t('Register_success'), { id: toastId });
          navigate("/login", { 
            state: { email: data.email },
            replace: true 
          });
        }
        form.reset();
      },
      onError: (error) => {
        toast.dismiss(toastId);
        const serverErrors = error.response?.data;

        if (serverErrors && typeof serverErrors === 'object') {
          Object.keys(serverErrors).forEach((field) => {
            form.setError(field, {
              type: "server",
              message: serverErrors[field][0],
            });
          });
          toast.error("Please check the fields");
        } else {
          toast.error(t('Register_error'));
        }
      }
    });
  };

  // مصفوفة لتسهيل صيانة الحقول وجعل الكود أنظف ومكرر بحرفية
  const fieldsConfig = [
    { name: "first_name", label: t('firstname'), type: "text", icon: User },
    { name: "last_name", label: t('lastname'), type: "text", icon: User },
    { name: "username", label: t('username'), type: "text", icon: User },
    { name: "email", label: t('email'), type: "email", icon: MailIcon },
    { name: "password", label: t('password'), type: "password", icon: LockIcon },
    { name: "confirm_password", label: t('confirm_password'), type: "password", icon: LockIcon },
    { name: "age", label: t('age'), type: "number", icon: null },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full pr-1">
        
        {/* توليد الحقول الديناميكية المرنة بنجاح */}
        {fieldsConfig.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg md:text-xl font-medium">{item.label}:</FormLabel>
                <FormControl>
                  <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-full max-w-[500px] h-fit rounded-2xl flex items-center px-4">
                    <InputGroupInput
                      {...field}
                      type={item.type}
                      placeholder={item.label}
                      className="placeholder:text-sm text-sm flex-grow bg-transparent border-none outline-none"
                    />
                    {item.icon && (
                      <InputGroupAddon className="flex-shrink-0 flex items-center">
                        <item.icon className='md:size-5 size-4 opacity-70' />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* حقل اختيار الجنس */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg md:text-xl font-medium">{t('gender')}:</FormLabel>
              <FormControl>
                <div className='w-full flex flex-col items-start px-1 pt-1'>
                  <RadioGroup 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="flex flex-row gap-6" // تم جعل الخيارات بجانب بعضها لتوفير مساحة عمودية على اللابتوب
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className='text-gray-500 text-sm md:text-base cursor-pointer'>{t('male')}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className='text-gray-500 text-sm md:text-base cursor-pointer'>{t('female')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />  

        {/* حقل رقم الهاتف */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg md:text-xl font-medium">{t('phone')}:</FormLabel>
              <FormControl>
                <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-full max-w-[500px] h-fit rounded-2xl flex items-center px-4">
                  <InputGroupInput
                    {...field}
                    type="tel"
                    placeholder="09xxxxxxxx"
                    className="placeholder:text-sm text-sm flex-grow bg-transparent border-none outline-none"
                  />
                  <InputGroupAddon className="flex-shrink-0 flex items-center">
                    <Phone className='md:size-5 size-4 opacity-70' />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      

<div className='flex justify-center w-full max-w-[500px] pt-6 pb-2 hover:opacity-85 active:scale-95 transition-all duration-200'>
  <Buttons type="register" />
</div> 

      </form>
    </Form>
  )
}

export default RegisterForm;