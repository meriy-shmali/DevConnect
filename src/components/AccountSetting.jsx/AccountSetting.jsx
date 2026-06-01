import React from 'react'
import AccountForm from './AccountForm';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const AccountSetting = () => {
   const { t } = useTranslation();
   const navigate = useNavigate();
  
  return (
    <div className="w-full bg-main-background dark:bg-dark-background dark:bg-[#1E1E1E] dark:text-gray-50 transition-colors duration-300 overflow-x-hidden">
      
      {/* 💡 المين الحاضن: تركنا العرض الكامل مع البادينغ المرن */}
      <main className="w-full px-4 lg:px-12 py-4 mt-8 lg:mt-14 flex flex-col items-start">
         
         {/* الحاوية العلوية أصبحت relative بشكل صريح ليمتثل لها الزر المطلق */}
         <div className="flex flex-row justify-between items-center w-full pb-4 relative min-h-[60px]">
           
           {/* العنوان الرئيسي */}
           <h1 className="title-font text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mt-6 mb-4 sm:my-0 flex-shrink-0">
             {t('account_setting')}
           </h1>

           {/* 🌟 زر الـ Saved السحري: حر ومطلق الصلاحية بدون div مقيد له 🌟 */}
           <button
             type="button"
             onClick={() => navigate('/saved-posts')}
             className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all group border border-gray-200 dark:border-zinc-700 cursor-pointer
                        /* 📱 على الموبايل والشاشات الصغيرة: يأخذ مكانه الطبيعي مستجيباً للـ Flex */
                        mt-5 sm:mt-0
                        /* 💻 على اللابتوب: يطير ويلتصق بأقصى حافة الحاوية اليمينية (أو اليسارية بالـ RTL) تماماً بدون شطحات */
                        lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 rtl:lg:right-auto rtl:lg:left-0"
            >
             <span className="text-sm md:text-md font-medium hidden sm:block">
               {t('saved')}
             </span>
             <Bookmark className="w-5 md:w-4 h-4 group-hover:scale-110 transition-transform" />
           </button>

         </div>

         {/* حاوية الـ AccountForm */}
         <div className="w-full mt-5">
            <AccountForm />
         </div>
      </main>
    </div>
  )
}

export default AccountSetting;