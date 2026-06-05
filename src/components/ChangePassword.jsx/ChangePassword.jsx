import ChangeForm from './ChangeForm'
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-main-background dark:bg-[#1E1E1E] transition-colors duration-300">
      <main main className="w-full max-w-[1000px]   mx-auto px-4 lg:px-12 xl:px-0 py-4 mt-8 lg:mt-10  flex flex-col items-start">
        <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black dark:text-white self-start mt-8 mb-10">
          {t('change_password')}
        </h1>
        <ChangeForm />
      </main>
    </div>
  )
}

export default ChangePassword;