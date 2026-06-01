import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import accountschema from '../Schema/AccountSchema';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { UseTheme } from './UseTheme';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { useUpdateAccount, useGetAccountData } from '@/hook/UseMutationAccount';
import i18next from 'i18next';

const AccountForm = () => {
    const { i18n, t } = useTranslation();
    const { theme, setTheme } = UseTheme();
    const { data: accountData } = useGetAccountData();
    const navigate = useNavigate();
    
    const form = useForm({
      resolver: zodResolver(accountschema(t)),
      defaultValues: {
        username: "",
        email: "",
        language: i18n.language, 
      },
    });
   
    const updateMutation = useUpdateAccount();
    const Values = form.watch();
    const hasData = accountData && Values.username !== accountData?.username;
    
    const onSubmit = (Values) => {
      updateMutation.mutate({ username: Values.username });
    };
    
    const themePlaceholder = theme === 'system' ? t('system') : theme === 'dark' ? t('dark') : t('light');

    useEffect(() => {
        const browserDefaultLang = navigator.language?.startsWith('ar') ? 'ar' : 'en';
        const savedLang = localStorage.getItem('i18nextLng');
        const userPreferredLang = accountData?.language || savedLang || browserDefaultLang;

        if (accountData) {
            form.reset({
                username: accountData?.username || "",
                email: accountData?.email || "",
                language: userPreferredLang
            });
        }

        if (userPreferredLang && i18n.language !== userPreferredLang) {
            i18n.changeLanguage(userPreferredLang);
            localStorage.setItem('i18nextLng', userPreferredLang);
            document.documentElement.dir = userPreferredLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = userPreferredLang;
        }
    }, [accountData, form.reset, i18n]);

 return (
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 text-black dark:text-white">

       {/* 🌟 حقل اسم المستخدم */}
       <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:w-[220px] lg:w-[300px] flex-shrink-0 text-xl md:text-2xl font-medium">
                {t('username')}:
              </FormLabel>
              <div className='flex flex-row items-center flex-1 w-full max-w-[600px] gap-2'>
                <div className='flex flex-col flex-1 min-w-0 relative'>
                  <FormControl>
                    <InputGroup className=" bg-white border-black border w-full px-3 h-fit rounded-xl focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all dark:bg-dark-post-background dark:border-white/20">
                      <InputGroupInput
                        {...field}
                        type='text'
                        autoComplete='off'
                        className="w-full text-md md:text-md dark:text-dark-text whitespace-nowrap overflow-x-auto scrollbar-hide" 
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage className="text-[14px] mt-1" />
                </div>
                {hasData && (
                  <div className='flex-shrink-0'>          
                    <Buttons  
                      className={`w-[90px] md:w-[120px] h-fit rounded-xl text-md font-semibold bg-blue-button hover:bg-blue-700 text-white transition-colors flex items-center justify-center ${updateMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      type="save"
                      disabled={updateMutation.isPending}
                    />   
                  </div>
                )} 
              </div>
            </FormItem>
          )}
        />

       {/* 🌟 حقل الإيميل */}
       <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:w-[220px] lg:w-[300px] flex-shrink-0 text-xl md:text-2xl font-medium">
                {t('email')}:
              </FormLabel>
              <div className='w-full max-w-[600px]'>
                <FormControl>
                  <InputGroup className="bg-gray-50 border-black/40 border w-full px-3 h-fit rounded-xl dark:bg-zinc-800/50 dark:border-white/10 pointer-events-none opacity-70">
                    <InputGroupInput
                      {...field}
                      type='email'
                      readOnly
                      disabled
                      className="w-full text-[18px] md:text-md text-gray-500 dark:text-zinc-400 cursor-not-allowed select-none outline-none"
                    />
                  </InputGroup>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

       {/* 🌟 حقل اللغة المطور مع إصلاح مشكلة السكرول */}
       <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:w-[220px] lg:w-[300px] flex-shrink-0 text-xl md:text-2xl font-medium">
                {t('language')}:
              </FormLabel>
              <div className='w-full max-w-[600px]'>  
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value); 
                      setTheme(value);
                      i18next.changeLanguage(value);  
                      localStorage.setItem('i18nextLng', value);  
                      document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
                      document.documentElement.lang = value;
                      form.reset({ ...form.getValues(), language: value });
                    }}
                  >
                    <SelectTrigger className={`bg-white border-black border w-full px-3 h-fit rounded-xl dark:bg-dark-post-background dark:border-white/20 focus:ring-1 focus:ring-blue-button ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <SelectValue placeholder={field.value === 'ar' ? t('arabic') : t('english')} />
                    </SelectTrigger>
                  
                    {/* 💡 حل السكرول: أضفنا onCloseAutoFocus لمنع Radix من قفل الـ pointer-events */}
                    <SelectContent 
                      className="bg-white dark:bg-dark-post-background border-black border w-[var(--radix-select-trigger-width)]" 
                      side='bottom' 
                      align={i18n.language === 'ar' ? 'end' : 'start'} 
                      sideOffset={5} 
                      position='popper' 
                      avoidCollisions={false}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <SelectItem value='en' className="text-[16px] dark:text-dark-text cursor-pointer">{t('english')}</SelectItem>
                      <SelectItem value='ar' className="text-[16px] dark:text-dark-text cursor-pointer">{t('arabic')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

       {/* 🌟 حقل المظهر مع إصلاح مشكلة السكرول */}
       <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full'>
              <FormLabel className="text-main-text dark:text-gray-50 md:w-[220px] lg:w-[300px] flex-shrink-0 text-xl md:text-2xl font-medium">
                {t('mode')}:
              </FormLabel>
              <div className='w-full max-w-[600px]'>
                <FormControl>
                  <Select onValueChange={(value) => { field.onChange(value); setTheme(value); }} value={theme}>
                    <SelectTrigger className={`bg-white border-black border w-full px-3 h-fit rounded-xl dark:bg-dark-post-background dark:border-white/20 focus:ring-1 focus:ring-blue-button ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <SelectValue placeholder={themePlaceholder} />
                    </SelectTrigger>
                  
                    {/* 💡 حل السكرول: أضفنا onCloseAutoFocus هنا أيضاً */}
                    <SelectContent 
                      className="bg-white dark:bg-dark-post-background border-black border w-[var(--radix-select-trigger-width)]" 
                      side='bottom' 
                      align={i18n.language === 'ar' ? 'end' : 'start'} 
                      sideOffset={5} 
                      position='popper' 
                      avoidCollisions={false}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <SelectItem value='light' className="cursor-pointer">
                        <div className={`flex items-center gap-2 w-full ${i18n.language === 'ar' ? 'flex-row-reverse justify-between' : ''}`}>
                          <span className="text-md">{t('light')}</span>
                          <Sun className="w-4 h-4" /> 
                        </div>
                      </SelectItem>
                      <SelectItem value='dark' className="cursor-pointer">
                        <div className={`flex items-center gap-2 w-full ${i18n.language === 'ar' ? 'flex-row-reverse justify-between' : ''}`}>
                          <span className="text-md">{t('dark')}</span>
                          <Moon className="w-4 h-4" /> 
                        </div>
                      </SelectItem>
                      <SelectItem value='system' className="cursor-pointer">
                        <div className={`flex items-center gap-2 w-full ${i18n.language === 'ar' ? 'flex-row-reverse justify-between' : ''}`}>
                          <span className="text-md">{t('system')}</span>
                          <Monitor className="w-4 h-4" /> 
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
            </FormItem>
          )}
        />
            
       {/* 🌟 رابط تغيير كلمة المرور */}<div className='w-full flex flex-col sm:flex-row justify-between items-center sm:items-center gap-6 mt-10 relative'> 
  
  {/* رابط تغيير كلمة المرور: يبقى ثابتاً في مكانه وبمحاذاة الحقول الطبيعية */}
  <div className='w-full sm:w-auto flex justify-start flex-shrink-0'>
    <Button 
      variant='link' 
      type='button'
      onClick={() => navigate('/change')}
      className='p-0 h-auto underline decoration-solid text-xl md:text-xl text-blue-button hover:opacity-90 cursor-pointer' 
    >
      {t('change_password')}
    </Button>
  </div>
   
  {/* زر تسجيل الخروج: 
      📱 على الموبايل: flex-1 مع w-full ليأخذ الحاوية ويقعد بالمنتصف تماماً بفضل justify-center
      💻 على اللابتوب (sm فما فوق): يطير تلقائياً لأقصى يمين الشاشة ليحاذي زر الـ Saved العلوي بمساعدة sm:absolute sm:right-0 (أو left-0 بالـ RTL)
  */}
  <div className="w-full sm:w-auto flex justify-center sm:absolute sm:right-0 rtl:sm:right-auto rtl:sm:left-0">
    <button 
      type="button"
      onClick={() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate('/', { replace: true });
      }}
      className="w-fit mt-2 sm:w-auto bg-[#AF2F51] hover:bg-[#b53e5d] text-white px-3 py-2 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-md justify-center text-sm font-medium cursor-pointer"
    >  
      <span>{t('logout')}</span>
      <LogOut className='w-4 h-4 rtl:rotate-180' />
    </button>
  </div>

</div>
          
     </form>
   </Form>
  );
}

export default AccountForm;