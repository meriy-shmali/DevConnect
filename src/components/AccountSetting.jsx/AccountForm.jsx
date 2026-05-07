//import{object, z}from 'zod';
import { useEffect, useState } from 'react';
import { useForm  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import accountschema from '../Schema/AccountSchema';
import { useNavigate } from 'react-router-dom';
import { LogOut,Sun,Moon,Monitor } from 'lucide-react';
import { UseTheme } from './UseTheme';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { SelectContent,SelectItem,SelectTrigger,SelectValue,Select} from "@/components/ui/select";
import { Button} from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
//import { useChangePasswordMutation } from '@/hook/UseMutationChangePassword';
import { useUpdateAccount,useGetAccountData } from '@/hook/UseMutationAccount';
import i18next from 'i18next';
import { email } from 'zod';
import { languages } from 'prismjs';
const AccountForm=()=>{
    const { theme , setTheme} = UseTheme();
    const {data : accountData}=useGetAccountData();
    const navigate = useNavigate();
    const [isOpen,setIsOpen]=useState (false);
    const [isOpens,setIsOpens]=useState (false);
    const form = useForm({
    resolver: zodResolver(accountschema),
    defaultValues: {
     username:"",
     email:"",
     language:"en",
    },
    
  });
   
   
    const updateMutation=useUpdateAccount();
   const Values = form.watch();
   const hasData = 
    Values.username !==accountData?.data?.username ;
   // const { mutate,isPending}=useChangePasswordMutation(form);
    const onSubmit = (Values) => {
    console.log("OnSubmit Triggered!", Values); // أضيفي هذا السطر
    updateMutation.mutate({username: Values.username});
};
   const { i18n,t } = useTranslation();
   const currentLang=i18n.language;
   const languagePlaceholder=currentLang==='ar'?t('arabic') : t('english');
   const themePlaceholder = theme === 'system' ? t('system') : theme === 'dark' ? t('dark') : t('light');
    useEffect(()=>{
      console.log("Account Data Received:", accountData);
      if(accountData && accountData.data){
        form.reset({
          username:accountData?.data?.username||"",
          email:accountData?.data?.email||"",
          language:accountData.language || "en"
        })
      }
    },[accountData,form.reset])
    console.log("Form Errors:", form.formState.errors);
console.log("Is Submitting:", form.formState.isSubmitting);
 return (
   <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full min-h-screen pb-20 space-y-6 text-black dark:text-white">

   <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem className='flex flex-col md:flex-row md:items-center md:gap-1 gap-2 w-full max-w-full overflow-hidden'>
          <FormLabel className=" text-main-text md:min-w-[250px] lg:min-w-[400px] flex-shrink-0 text-[30px] md:text-[40px] 
           lg:text-[40px] ">{t('username')}
          </FormLabel>
          <div className='flex flex-col lg:items-center md:items-center md:flex-row sm:item-start w-full lg:max-w-[600px] md:max-w-[500px] gap-2 '>
            <div className='flex flex-col flex-1 min-w-0 relative'>
          <FormControl className='flex-1'>
            <InputGroup className="  flex-shrink-0 py-1.25
             group bg-white border-black border w-full px-3  h-[46px] lg:max-w-[500px] md:max-w-[400px] 
             focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
             focus-within: outline-none dark:bg-dark-post-background dark:border-white/20 ">
              <InputGroupInput
                {...field}
                type='text'
                placeholder=""
                className=" flex-shrink-0  md:text-[22px] text-[22px] dark:text-dark-text whitespace-nowrap overflow-x-auto
                overflow-y-hidden scrollbar-hide" 
                style={{wordBreak:'keep-all'}}
              />
            </InputGroup>
          </FormControl>
          <div className='  w-full mt-1 '>
           <FormMessage className="  md:text-[20px] text-[20px] " />
          </div></div>
           {hasData && (
            <div className=' flex-shrink-0'>          
              <Buttons  
              className={`flex-shrink-0 w-[100px] md:w-[120px] hover:bg-blue-800 text-white px-5 py-2.5 rounded-sm text-sm 
                transition-colors bg-blue-button hover:bg-blue-700 text-text-button text-[17px] font-medium
               font-black h-[46px]  md:text-4xl !cursor-pointer ${updateMutation.isPending ? 'opacity-50 cursor-not-allowed':'cursor-pointer'}`}
              type="submit"
              disabled={updateMutation.isPending}/>   
              </div>)} 
          
          </div>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className='flex flex-col md:flex-row md:item-center gap-2  md:gap-1 w-full max-w-full overflow-hidden'>
          <FormLabel className="text-main-text md:min-w-[250px] lg:min-w-[400px] flex-shrink-0 text-[30px] md:text-[40px]  lg:text-[40px]">{t('email')}
          </FormLabel>
          <div className='flex flex-col flex-1 min-w-0 relative'>
          <FormControl>
           <InputGroup className="bg-gray-100 text-gray-500  group   px-3 lg:max-w-[500px] md:max-w-[400px] h-[46px] mb-4
            focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all 
            focus-within: outline-none dark:bg-dark-post-background dark:border-white/20  translate-y-1 md:translate-y-2">
              <InputGroupInput
                {...field}
                type='email'
                readOnly
                placeholder=""
                className=" md:text-[22px] text-[22px] dark:text-dark-text 
                whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide cursor-not-allowed"
              />
            </InputGroup>
          </FormControl>
         
          </div>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className='flex flex-col md:flex-row md:items-start gap-2 md:gap-1'>
          <FormLabel className="text-main-text md:min-w-[250px] lg:min-w-[400px] flex-shrink-0
           text-[30px] md:text-[40px]  lg:text-[40px]">{t('language')}: </FormLabel>
          <div className='flex flex-col w-full max-w-[500px] transition-all ease-in-out duration-300 overflow-visible '
           style={{marginBottom : isOpen?'90px' : '0px',
            textAlign:'left',display:'block'}}>  
          <FormControl>
            <Select onOpenChange={
              (open)=>setIsOpen(open)} defaultValues={currentLang} onValueChange={(value)=>{field.onChange(value);
              i18next.changeLanguage(value); document.documentElement.dir=value==='ar'? 'rtl' :'ltr';
              document.documentElement.lang=value }} value={field.value} className='text-start'>
            <SelectTrigger className=" group bg-white border-black border w-full px-3 lg:max-w-[500px] md:max-w-[400px] h-[46px] mb-4
            focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all
             focus-within: outline-none dark:bg-dark-post-background dark:border-white/20  translate-y-1 md:translate-y-2">
             <div className='md:text-[22px] text-[22px] dark:text-dark-text pl-3'> 
              <SelectValue placeholder={languagePlaceholder} />
             </div>
            </SelectTrigger>
          
          <SelectContent className='bg-white border-black border-[1px] max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)] '
          side='bottom' align='start' sideOffset={5} position='popper' avoidCollisions={false}>
           <SelectItem value='en' className='md:text-[18px] text-[18px] dark:text-dark-text'>{t('english')} </SelectItem>
           <SelectItem value='ar' className='md:text-[18px] text-[18px] dark:text-dark-text'>{t('arabic')}</SelectItem>
           </SelectContent>
           </Select>
          </FormControl>
          </div>
        </FormItem>
      )}
    />
     <FormField
      control={form.control}
      name="mode"
      render={({ field }) => (
        <FormItem className='flex flex-col md:flex-row md:item-center gap-2 md:gap-1'>
          <FormLabel className="text-main-text md:min-w-[250px] lg:min-w-[400px] flex-shrink-0
           text-[30px] md:text-[40px]  lg:text-[40px]">{t('mode')}: </FormLabel>
          <div className='flex flex-col w-full max-w-[500px]'>
          <FormControl>
            <Select onValueChange={(value)=>{field.onChange(value); setTheme(value)}} onOpenChange={
              (opens)=>setIsOpens(opens)} defaultValues={theme}
              >
            <SelectTrigger className=" group bg-white border-black border w-full px-3 lg:max-w-[500px] md:max-w-[400px] h-[46px] mb-4
            focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all
             focus-within: outline-none dark:bg-dark-post-background dark:border-white/20  translate-y-1 md:translate-y-2">
             <div className='md:text-[22px] text-[22px] dark:text-dark-text pl-3'> 
              <SelectValue placeholder={themePlaceholder} />
             </div>
            </SelectTrigger>
          
          <SelectContent className='bg-white border-black border-[1px] max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)] '
          side='bottom' align='start' sideOffset={5} position='popper' avoidCollisions={false}>
           <SelectItem value='light' className='md:text-[18px] text-[18px] dark:text-dark-text'>
             <div className="flex items-center gap-2">
             <span className="md:text-[18px] text-[18px]">{t('light')}</span>
              <Sun className="w-4 h-4" /> 
             </div>
           </SelectItem>
            <SelectItem value='dark' className='md:text-[18px] text-[18px] dark:text-dark-text'>
              <div className="flex items-center gap-2">
             <span className="md:text-[18px] text-[18px]">{t('dark')}</span>
              <Moon className="w-4 h-4" /> 
             </div>
            </SelectItem>
           <SelectItem value='system' className='md:text-[18px] text-[18px] dark:text-dark-text'>
           <div className="flex items-center gap-2">
             <span className="md:text-[18px] text-[18px]">{t('system')}</span>
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
            
           <div className='w-full transition-all ease-in-out duration-300 overflow-visible '
           style={{marginTop : isOpens?'120px' : '40px',marginBottom : isOpens?'20px' : '0',
            textAlign:'left',display:'block'}}>  
            
           <div className='w-full flex justify-start items-start '>
            <Button variant='link' type='button'
            onClick={()=>navigate('/change')}
            className=' p-0 h-auto  text-left items-start justify-start underline decoration-solid decoration-skip-ink-none 
            underline-offset-9 text-[25px] text-blue-button hover:opacity-90
             md:text-[30px]  lg:text-[35px] cursor-pointer' 
             style={{marginLeft:'0',paddingLeft:'0'}}>
              {t('change_password')}
            
             </Button>
            </div>
            </div>
        <div className="flex justify-center pt-8 ">
        <button 
          type="button"
          onClick={()=>{ localStorage.clear(); 
          window.location.href = '/login'; }}
          className="bg-[#AF2F51] hover:bg-red-700 text-white px-8 py-2.5 rounded-lg flex items-center
           gap-2 transition-transform active:scale-95 shadow-md justify-center text-[17px] font-medium"
        >  
          <span className="text-2xl">{t('logout')}</span>
           <LogOut className='w-5 h-5 rtl:rotate-180'/>
        </button>
      </div>
          
  </form>
</Form>

  );
}

 export default AccountForm;
