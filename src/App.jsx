import './App.css'
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom'; // ← أضيفي useLocation
import { useEffect } from 'react';
import { requestForToken } from './firebase/firebaseConfig';
import { useNotificationMutation } from './hook/UseNotificationMutation';
import { useNotificationLogic } from './hook/UseNotificationLogic';

// ← أضيفي هاد الـ component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function NotificationWrapper({ children }) {
  useNotificationLogic();
  return children;
}

function App() {
  const { i18n } = useTranslation();
  const { updateToken } = useNotificationMutation();

  useEffect(() => {
    if (updateToken?.mutate) {
      requestForToken(updateToken);
    }
  }, [i18n.language, updateToken?.mutate]);

  return (
    <>
      <ScrollToTop /> {/* ← أضيفيها هون */}
      <Outlet />
    </>
  );
}

export default App;
