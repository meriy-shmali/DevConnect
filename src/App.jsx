
import './App.css'
import Welcomepage from './components/Welcomepage'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
//import { Toaster } from 'react-hot-toast';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return ( 
    
      <> 
      <Welcomepage />    
      <div className="fixed top-5 right-5 z-50 flex gap-2"></div>
      </>
      
      
    
  );
}

export default App
