
import './App.css'
import Welcomepage from './components/Welcomepage'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return ( 
    <>
    <Toaster position='top-center' toastOptions={{
      duration:3000,
      className: "shadow-lg",
      style:{
        fontSize:"16px",
        borderRadius: "10px",
        padding: "12px 16px",
      },
         success: {
        style: {
    background: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #10b981",
  },
      icon: "✅",
    }
      ,error: {
       style: {
    background: "#fef2f2",
    color: "#7f1d1d",
    border: "1px solid #ef4444",
  },
      icon: "❌",
    },
  
    }}>
      <div>
      <Welcomepage/>
        </div>
        </Toaster>
        <div className="fixed top-5 right-5 z-50 flex gap-2">
 
</div>
    </>
    
  )
}

export default App
