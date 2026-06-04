import React from 'react'
import AccountForm from './AccountForm';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const AccountSetting = () => {
   const { t } = useTranslation();
   const navigate = useNavigate();
  
  return (
    // الحفاظ على ألوان الخلفيات الخاصة بكِ تماماً
    <div className="w-full bg-main-background dark:bg-dark-background dark:bg-[#1E1E1E] dark:text-gray-50 transition-colors duration-300 overflow-x-hidden">
      
      {/* 🌟 المين الحاضن: حددنا له max-w موحد لضمان التوازى الشاقولي للأطراف على كل الشاشات */}
      <main className="w-full max-w-[1000px] mx-auto px-4 lg:px-12 py-4 mt-8 lg:mt-14 flex flex-col items-start">
         
         {/* الحاوية العلوية: flex-row ممتد يرمي زر Saved في آخر الطرف يميناً دائماً */}
         <div className="flex flex-row justify-between items-center w-full pb-4 min-h-[60px]">
           
           {/* العنوان الرئيسي كمظهركِ الأصلي */}
           <h1 className="title-font text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mt-6 mb-4 sm:my-0 flex-shrink-0">
             {t('account_setting')}
           </h1>

           {/* 🌟 زر الـ Saved السحري: بنفس التنسيقات والألوان والأيقونة الخاصة بكِ بدون تغيير */}
           <button
             type="button"
             onClick={() => navigate('/saved-posts')}
             className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all group border border-gray-200 dark:border-zinc-700 cursor-pointer flex-shrink-0"
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