import{z}from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginschema from '@/components/Schema/LoginSchema.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
//import jwtDecode from 'jwt-decode';
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
//  const {setCurrentUser }=useAuth()
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
//const decodedData = jwtDecode(access);
 // setCurrentUser(decodedData);
 toast.dismiss(toastId);
      toast.success(t('Login_sucess'), {
        id: toastId,
      });
      form.reset();
      setTimeout(() => {
          navigate("/feed");
        }, 800);
    },
    onError: () => {
      toast.error(t('Login_error'), {
        id: toastId,
      });
    }
  });
    
  };
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
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
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
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="password"
                placeholder="•••••••"
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
   <div> <Button variant='link' className=' underline text-[24px] text-gray-700'>{t('forgot_password')}</Button></div>
           <div className='flex justify-center p-4'><Buttons type="login" disabled={loginMutaion.isPending} /></div> 
            
            <div className='flex-col  justify-center justify-items-center space-y-8 mt-8 '>
            <div className='flex-col space-y-2'><p className='text-[24px]'>{t('dont_have_account')}</p>
            <div><Button onClick={()=>navigate('/register') } variant='link' className=' underline text-[24px] text-gray-700'>{t('createaccount')}</Button></div></div>
            </div>
  </form>
</Form>

  );
}

 export default LoginForm;
