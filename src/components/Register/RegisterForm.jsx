import React from 'react'
import{z}from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import registerschema from '../Schema/RegisterSchema';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { MailIcon ,LockIcon, User, PhoneCall, Phone } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { fi } from 'zod/v4/locales';
import { useregister } from '@/hook/UseMutationRegister';

const RegisterForm = () => {
    const { t } = useTranslation();
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
  const { i18n } = useTranslation();
const isRTL = i18n.language === "ar";
  const registerMutation=useregister();
  const navigate=useNavigate();
    const onSubmit = async (data) => {
      const toastId = toast.loading("Creating account...");

  registerMutation.mutate(data, {
    onSuccess: (res) => {
      // 1. إذا كان الباك-أند يرسل التوكن فوراً (Auto-login)، احفظيها هنا لتخطي خطوة اللوجين
      if (res.data?.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        
        // الانتقال للـ Feed مباشرة وحذف اللوجين من التاريخ
        toast.success(t('Register_success'), { id: toastId });
        navigate("/feed", { replace: true });
      } else {
        // 2. إذا كان لا بد من اللوجين، انتقلي فوراً
        // لا تستخدمي setTimeout، دعي التوست يظهر في صفحة اللوجين
        toast.success(t('Register_success'), { id: toastId });
        
        // تمرير البيانات لصفحة اللوجين لملء الحقول تلقائياً (سرعة إضافية للمستخدم)
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
}
    
   
  ;

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
    <FormField
      control={form.control}
      name="first_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl md:text-2xl">{t('firstname')}:</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="text"
                placeholder={t('firstname')}
                className="placeholder:md:text-md text-sm text-start "
              />
              <InputGroupAddon>
                <User className='md:size-5 size-4 ms-1' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="last_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl md:text-2xl">{t('lastname')}:</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow md:w-[500px] w-[300px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="text"
                placeholder={t('lastname')}
                className="placeholder:md:text-md text-sm "
              />
              <InputGroupAddon>
                <User className='md:size-5 size-4 ms-1' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl md:text-2xl">{t('username')}:</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow md:w-[500px] w-[300px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="text"
                placeholder={t('username')}
                className="placeholder:md:text-md text-sm "
              />
              <InputGroupAddon>
                <User className='md:size-5 size-4 ms-1' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl md:text-2xl">{t('email')}:</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="email"
                placeholder="Example@mail.com"
                className="placeholder:text-sm md:text-md "
              />
              <InputGroupAddon>
                <MailIcon className='md:size-5 size-4 ms-1'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-xl md:text-2xl">{t('password')}:</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="password"
                placeholder={t('enterpass')}
                className="placeholder:md:text-md text-sm "
              />
              <InputGroupAddon>
                <LockIcon className='md:size-5 size-4 ms-1'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="confirm_password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-xl md:text-2xl">{t('confirm_password')}:</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="password"
                placeholder={t('confirm_password')}
                className=" placeholder:md:text-md text-sm "
              />
              <InputGroupAddon>
                <LockIcon className='md:size-5 size-4 ms-1'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-xl md:text-2xl">{t('age')}:</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="number"
                placeholder=""
                className="placeholder:md:text-md text-sm "
              />
              <InputGroupAddon>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />   
     <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-xl md:text-2xl">{t('gender')}:</FormLabel>
          <FormControl>
            <div className='w-full flex flex-col items-start ms-2'>
           <RadioGroup onValueChange={field.onChange}
  defaultValue={field.value}
  dir={isRTL ? "rtl" : "ltr"}>
  <div className="flex items-center gap-2 ">
    <RadioGroupItem value="male" id="male" />
    <Label htmlFor="male" className='text-gray-500 md:text-md text-sm'>{t('male')}</Label>
  </div>
  <div className="flex items-center gap-2 ">
    <RadioGroupItem value="female" id="female" />
    <Label htmlFor="female" className='text-gray-500 md:text-md text-sm'>{t('female')}</Label>
  </div>
</RadioGroup> </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />  
      <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-xl md:text-2xl">{t('phone')}:</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder hover:bg-hover-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl flex items-center px-2">
              <InputGroupInput
                {...field}
                type="tel"
                
                className=" placeholder:md:text-md text-sm  "
              />
              <InputGroupAddon>
                <Phone className='md:size-5 size-4 ms-1  '/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  
<div className='flex justify-center p-4'><Buttons type="register"/></div> 

  </form>
</Form>

  )
}

export default RegisterForm