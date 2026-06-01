import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query';
import { RouterProvider } from "react-router-dom";
import router from './Router';
import './i18next'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
function DirectionWrapper({ children }) {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return children;
}
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DirectionWrapper>
        <Toaster position='top-center'
        containerStyle={{
          zIndex:999999,
        }} toastOptions={{
          duration: 3000,
          className: "shadow-lg",
          style: {
            fontSize: "1rem",
            borderRadius: "0.5rem",
            padding: "14px 20px",
            fontWeight: "500"
           
          }
        }} />
     <RouterProvider router={router} />
     </DirectionWrapper>
     </AuthProvider>
     </QueryClientProvider>
  </StrictMode>
)
