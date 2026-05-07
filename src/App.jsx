
import './App.css'
import Welcomepage from './components/Welcomepage'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { requestForToken } from './firebase/firebaseConfig';
import { useNotificationMutation } from './hook/UseNotificationMutation';
import { useNotificationLogic } from './hook/useNotificationLogic';
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './Router';

 
function NotificationWrapper({ children }) {
  useNotificationLogic(); // تفعيل المستمع هنا
  return children;
}
function App() {
   const { i18n } = useTranslation();
  const { updateToken } = useNotificationMutation(); 

  // طلب التوكن (هذا المنطق يبقى هنا لأنه يحتاج للعمل مرة واحدة عند التشغيل)
  useEffect(() => {
    if (updateToken?.mutate) {
      requestForToken(updateToken);
    }
  }, [i18n.language, updateToken?.mutate]); 
  return ( 
    <>
      <div>
        <ToastContainer/>
        <RouterProvider router={router}/>
      </div>
    </>
    
  )
}

export default App
