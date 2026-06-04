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
import { MailIcon, LockIcon } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { uselogin } from '@/hook/UseMutaionLogin';

const LoginForm = () => {
  const { t } = useTranslation();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutaion = uselogin();
  const { setCurrentUser } = useAuth(); 

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    loginMutaion.mutate(data, {
      onSuccess: (res) => {
        const access = res?.data?.access || res?.access;
        const refresh = res?.data?.refresh || res?.refresh;

        if (access && refresh) {
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);

          setCurrentUser({ loggedIn: true }); 

          navigate("/feed", { replace: true });

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
      {/* تم جعل الحاوية w-full لتتناسب مرونتها مع شاشات اللابتوب المختلفة */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">

        {/* حقل البريد الإلكتروني */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => ( // ✅ تم إصلاح الخطأ هنا عبر تمرير الـ field بشكل صحيح
            <FormItem className="w-full">
              <FormLabel className="text-lg md:text-xl font-medium">{t('email')}:</FormLabel>
              <FormControl>
                {/* تم استبدال العرض الثابت بـ w-full مع تحديد max-w لحماية الشاشات الكبيرة */}
                <InputGroup className="hover:bg-hover-placeholder bg-light-placeholder shadow w-full max-w-[500px] h-fit rounded-2xl flex items-center px-4">
                  <InputGroupInput
                    {...field}
                    type="email"
                    placeholder="Example@mail.com"
                    className="placeholder:text-sm text-sm flex-grow bg-transparent border-none outline-none"
                  />
                  <InputGroupAddon className="flex-shrink-0 flex items-center">
                    <MailIcon className='md:size-5 size-4 opacity-70' />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* حقل كلمة المرور */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => ( // ✅ تم إصلاح الخطأ هنا عبر تمرير الـ field بشكل صحيح
            <FormItem className="w-full">
              <FormLabel className="text-lg md:text-xl font-medium">{t('password')}:</FormLabel>
              <FormControl>
                {/* تم استبدال العرض الثابت بـ w-full مع تحديد max-w لحماية الشاشات الكبيرة */}
                <InputGroup className="hover:bg-hover-placeholder bg-light-placeholder shadow w-full max-w-[500px] h-fit rounded-2xl flex items-center px-4">
                  <InputGroupInput
                    {...field}
                    type="password"
                    placeholder={t('enterpass')}
                    className="placeholder:text-sm text-sm flex-grow bg-transparent border-none outline-none"
                  />
                  <InputGroupAddon className="flex-shrink-0 flex items-center">
                    <LockIcon className='md:size-5 size-4 opacity-70' />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* روابط المساعدة (نسيت كلمة المرور) */}
        <div className='flex justify-start w-full max-w-[500px]'>
          <Button
            variant='link'
            onClick={(e) => {
              e.preventDefault();
              setIsForgotModalOpen(true);
            }}
            className='underline text-sm md:text-base text-gray-600 hover:text-gray-800 p-0 h-auto'
          >
            {t('forgot_password')}
          </Button>
        </div>

        {isForgotModalOpen && (
          <ForgotPasswordModal
            isOpen={isForgotModalOpen}
            onClose={() => setIsForgotModalOpen(false)}
          />
        )}

        {/* زر تسجيل الدخول موجه في المنتصف */}
        <div className='flex justify-center w-full max-w-[500px] pt-6 pb-2 hover:opacity-85 active:scale-95 transition-all duration-200'>
          <Buttons type="login" disabled={loginMutaion.isPending} />
        </div> 
        
        {/* إنشاء حساب جديد */}
        <div className='flex flex-row justify-center items-center gap-1 text-sm md:text-base pt-2 w-full max-w-[500px]'>
          <p className='text-gray-500'>{t('Noaccount')}</p>
          <Button 
            onClick={() => navigate('/register')} 
            variant='link' 
            className='underline text-gray-700 hover:text-gray-900 font-medium p-0 h-auto'
          >
            {t('createaccount')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
