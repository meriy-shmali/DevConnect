import React from 'react'
import AccountForm from './AccountForm';
import Header from './Header';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
const AccountSetting = () => {
      const { t } = useTranslation();
      const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-main-background dark:bg-dark-background dark:text-gray-50 dark:bg-[#1E1E1E]   transition-colors duration-300">
      <Header />
      <main className="  mx-auto py-4 ml-4 mr-8 md:ml-20  mb-8 flex flex-col items-start ">
         <div className="flex items-center justify-between w-full  pb-4 dark:border-white/10">
          <h1 className="title-font text-[48px] md:text-[70px] font-bold self-start mt-8 mb-10">
          {t('account_setting')}
          </h1>
           <button
             type="button"
             onClick={() => navigate('/saved-posts')}
             className="flex items-center gap-2 px-4 py-2 md:mr-8  bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all group border dark:border-zinc-700"
            >
            <span className="text-lg md:text-xl font-medium  md:block">
              {t('saved')}
            </span>
            <Bookmark className="w-6 h-6  group-hover:scale-110 transition-transform" />
            </button>
            </div>
          <AccountForm />
           
      </main>
    </div>
  )
}

export default AccountSetting