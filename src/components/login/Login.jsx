import React from 'react'
import LoginForm from './LoginForm'
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  
  return (
    // تم تغيير h-full إلى min-h-screen وتأمين التوسيط والـ flex-row
    <div className='bg-main-background min-h-screen relative z-50 dark:text-dark-text flex flex-col md:flex-row items-center justify-center lg:justify-between px-6 md:px-12 lg:px-24 py-2 gap-10 max-w-7xl  mx-auto w-full'>
      
      {/* قسم الفورم والترحيب */}
      <div className='mt-12 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 flex flex-col items-center md:items-start w-full max-w-[450px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] 2xl:max-w-[650px]'>
        <div className='w-full mb-10'>
          {/* تم تعديل md:text-left إلى md:text-start لدعم الـ RTL تلقائياً */}
          <p className='title-font text-3xl lg:text-4xl xl:5xl 2xl:8xl font-bold text-center md:text-start leading-tight'>
            {t('welcome_back')}
          </p>
        </div>
        
        <div className='w-full'>
          <LoginForm />
        </div>
      </div>
        
      {/* قسم الصورة - جعلناه مرناً ومحدداً بحد أقصى لمنع دفع العناصر */}
      <div className='w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] flex-shrink-0 flex justify-center'>
        <img 
          src='src/images/login.png' 
          alt="Login illustration" 
          className='w-full h-auto object-contain'
        />
      </div>

    </div>
  )
}

export default Login;