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
  const registerMutation=useregister();
  const navigate=useNavigate();
    const onSubmit = async (data) => {
const toastId = toast.loading("Creating account...");

  registerMutation.mutate(data, {

    onSuccess: () => {

      toast.success(t('Register_success'), {
        id: toastId,
      });
     form.reset();
     setTimeout(() => {
          navigate("/login");
        }, 800);

    },
    onError: (error) => {
      //اغلاق التحميل فور حدوث الخطأ
      toast.dismiss(toastId);

      // إذا كان الخطأ بسبب بيانات مكررة (Email, Phone, Username)
      const serverErrors = error.response?.data;

      if (serverErrors && typeof serverErrors === 'object') {
        // نمر على كل حقل أرسله السيرفر كخطأ ونعرضه تحت الإدخال المناسب
        Object.keys(serverErrors).forEach((field) => {
          form.setError(field, {
            type: "server",
            message: serverErrors[field][0], // مثلاً: "email already exists"
          });
        });
        
        // إظهار توست عام ينبه المستخدم لوجود أخطاء في الحقول
        toast.error("Please check the highlighted fields");
      } else {
        // خطأ عام في حال انقطاع السيرفر أو مشكلة غير متوقعة
        toast.error(t('Register_error'));
      }
    }
  
  },
  )}
    
   
  ;

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
    <FormField
      control={form.control}
      name="first_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('firstname')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="text"
                placeholder="first name"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
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
          <FormLabel className="text-[30px] md:text-[48px]">{t('lastname')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="text"
                placeholder="last name"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
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
          <FormLabel className="text-[30px] md:text-[48px]">{t('username')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="text"
                placeholder="username"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
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
          <FormLabel className="text-[30px] md:text-[48px]">{t('email')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="email"
                placeholder="example@mail.com"
                className="placeholder:text-[22px] mt-1"
              />
              <InputGroupAddon>
                <MailIcon className='size-6'/>
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
          <FormLabel className=" text-[30px] md:text-[48px]">{t('password')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="password"
                placeholder="•••••••"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
                <LockIcon className='size-6'/>
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
          <FormLabel className=" text-[30px] md:text-[48px]">{t('confirm_password')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="password"
                placeholder="•••••••"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
                <LockIcon className='size-6'/>
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
          <FormLabel className=" text-[30px] md:text-[48px]">{t('age')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="number"
                placeholder=""
                className="placeholder:text-[22px] mt-3"
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
          <FormLabel className=" text-[30px] md:text-[48px]">{t('gender')}</FormLabel>
          <FormControl>
            <div className='ml-2'>
           <RadioGroup onValueChange={field.onChange}
  defaultValue={field.value}>
  <div className="flex items-center space-x-2 ">
    <RadioGroupItem value="male" id="male" />
    <Label htmlFor="male" className='text-gray-500 text-[20px]'>{t('male')}</Label>
  </div>
  <div className="flex items-center space-x-2 ">
    <RadioGroupItem value="female" id="female" />
    <Label htmlFor="female" className='text-gray-500 text-[20px]'>{t('female')}</Label>
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
          <FormLabel className=" text-[30px] md:text-[48px]">{t('phone_number')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="tel"
                placeholder="phone"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
             <Phone className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />  
<div className='flex justify-center p-4'><Buttons type="login"/></div> 

  </form>
</Form>

  )
}

export default RegisterForm