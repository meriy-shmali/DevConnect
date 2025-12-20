
import './App.css'
import Welcomepage from './components/Welcomepage'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return ( 
    <>
      <div>
      <Welcomepage/>
        </div>
    </>
    
  )
}

export default App
