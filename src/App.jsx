
import './App.css'
import Welcomepage from './components/Welcomepage'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { requestForToken } from './firebase/firebaseConfig';
import { useNotificationMutation } from './hook/UseNotificationMutation';
import { RouterProvider } from 'react-router';
import router from './Router';

function App() {
  const { i18n } = useTranslation();
  const { updateToken } = useNotificationMutation();
  
  useEffect(() => {
    requestForToken(updateToken);
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return ( 
    <>
      <div>
      <RouterProvider router={router}/>
        </div>
    </>
    
  )
}

export default App
