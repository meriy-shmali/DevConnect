import{z}from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import loginschema from '@/components/Schema/LoginSchema.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getchoichreq } from '@/api/Getchoichapi';
import { useState } from 'react';
import { ForgotPasswordModal } from '../ChangePassword.jsx/ForgotPasswordModal';

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
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
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
 const { setCurrentUser } = useAuth(); // 🌟 تأكدي من جلب الـ setCurrentUser من الـ Hook في الأعلى

const onSubmit = async (data) => {
  const toastId = toast.loading("Logging in...");

  loginMutaion.mutate(data, {
    onSuccess: (res) => {
      // 🌟 جلب التوكنات بشكل آمن حسب طريقة رد الباك إيند (سواء داخل data أو مباشرة)
      const access = res?.data?.access || res?.access;
      const refresh = res?.data?.refresh || res?.refresh;

      if (access && refresh) {
        // 1. حفظ التوكنات فوراً في الـ localStorage
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        // 2. تحديث الـ Context فوراً ليعلم التطبيق أن هناك مستخدم سجل دخوله
        // نقوم بوضع قيمة مؤقتة أو تفكيك التوكن، المهم ألا تبقى null
        setCurrentUser({ loggedIn: true }); 

        // 3. التوجيه الفوري إلى صفحة الـ Feed لمنع أي تضارب
        navigate("/feed", { replace: true });

        // 4. عمل الـ prefetch في الخلفية دون التأثير على سرعة التوجيه
        queryClient.prefetchQuery({
          queryKey: ['posts', undefined], 
          queryFn: () => getchoichreq(),
          staleTime: 1000 * 60 * 5,
        });

        toast.dismiss(toastId);
        toast.success(t('Login_sucess'), {
          id: toastId,
          duration: 2000
        });
        form.reset();
      } else {
        toast.dismiss(toastId);
        toast.error("خطأ في بنية البيانات القادمة من السيرفر");
        console.error("استجابة الباك إيند غير متوقعة:", res);
      }
    },
    onError: () => {
      toast.dismiss(toastId);
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
          <FormLabel className="text-xl md:text-2xl">{t('email')}:</FormLabel>
          <FormControl>
            <InputGroup className="hover:bg-hover-placeholder bg-light-placeholder shadow w-[300px] md:w-[500px] h-fit rounded-2xl">
              <InputGroupInput
                {...field}
                type="email"
                placeholder="Example@mail.com"
                className="placeholder:md:text-md text-sm mt-1  "
              />
              <InputGroupAddon>
                <MailIcon className='md:size-5 size-4 mr-2' />
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
            <InputGroup className=" hover:bg-hover-placeholder bg-light-placeholder shadow w-[300px]  md:w-[500px] h-fit rounded-2xl">
              <InputGroupInput
                {...field}
                type="password"
                placeholder={t('enterpass')}
                className="placeholder:md:text-md text-sm mt-2 "
              />
              <InputGroupAddon>
                <LockIcon className='md:size-5 size-4 mr-3' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
   <div><div className='flex justify-start items-start'>
  <Button
    variant='link'
    onClick={(e) => {
      e.preventDefault();
      setIsForgotModalOpen(true);
    }}
    className='underline text-md md:text-lg text-gray-700 hover:text-gray-500 '
  >
    {t('forgot_password')}
  </Button>
</div>

{isForgotModalOpen && (
  <ForgotPasswordModal
    isOpen={isForgotModalOpen}
    onClose={() => setIsForgotModalOpen(false)}
  />
)}</div>
           <div className='flex justify-center '><Buttons type="login" disabled={loginMutaion.isPending} /></div> 
            
            <div className='flex-col  justify-center justify-items-center  '>
            <div className='flex justify-center items-center'><p className='text-lg'>{t('Noaccount')}</p>
            <Button onClick={()=>navigate('/register') } variant='link' className=' underline text-md text-gray-700 hover:text-gray-500 hover:font-semibold'>{t('createaccount')}</Button></div>
            </div>
  </form>
</Form>

  );
}

 export default LoginForm;
