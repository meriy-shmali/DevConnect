import{z}from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginschema from '@/components/Schema/LoginSchema.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getchoichreq } from '@/api/Getchoichapi';
import { useQueryClient } from '@tanstack/react-query';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { MailIcon ,LockIcon } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { uselogin } from '@/hook/UseMutaionLogin';

const LoginForm=()=>{
  const{t}=useTranslation()
const queryClient = useQueryClient();
    const navigate=useNavigate();
const form = useForm({
    resolver: zodResolver(loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
    
  });
  const loginMutaion=uselogin();
   const onSubmit = async (data) => {
const toastId = toast.loading("Logging in...");

  loginMutaion.mutate(data, {

    onSuccess: (res) => {
      //لحفظ التوكين بعد القيام بتسجيل الدخول
       const access = res.data.access;
  const refresh = res.data.refresh;
   localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
queryClient.prefetchQuery({
          queryKey: ['posts', undefined], 
           queryFn: ()=>getchoichreq(),
           staleTime: 1000 * 60 * 5,
        });
 toast.dismiss(toastId);
      toast.success(t('Login_sucess'), {
        id: toastId,
        duration: 2000
      });
      form.reset();
      navigate("/feed", { replace: true })},
    onError: () => {
      toast.error(t('Login_error'), {
        id: toastId,
      });
    }
    
    
    })};
 return (
   <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('email')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px] rounded-2xl">
              <InputGroupInput
                {...field}
                type="email"
                placeholder="example@mail.com"
                className="placeholder:text-[22px] mt-1"
              />
              <InputGroupAddon>
                <MailIcon className='size-6' />
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
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px] rounded-2xl">
              <InputGroupInput
                {...field}
                type="password"
                placeholder="enter your password"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <LockIcon className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
   <div> <Button variant='link' className=' underline text-[22px] text-gray-700 hover:text-gray-500'>{t('forgot_password')}</Button></div>
           <div className='flex justify-center p-4'><Buttons type="login" disabled={loginMutaion.isPending} /></div> 
            
            <div className='flex-col  justify-center justify-items-center space-y-3 mt-5 '>
            <div className='flex justify-center items-center'><p className='text-[22px]'>{t('Noaccount')}</p>
            <Button onClick={()=>navigate('/register') } variant='link' className=' underline text-[22px] text-gray-700 hover:text-gray-500'>{t('createaccount')}</Button></div>
            </div>
  </form>
</Form>

  );
}

 export default LoginForm;
