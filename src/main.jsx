import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query';
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
//import AccountSettings from './components/AccountSettings';
import router from './Router';
import './i18next'
//import { BrowserRouter } from 'react-router-dom';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
 
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
     </QueryClientProvider>
  </StrictMode>
)
