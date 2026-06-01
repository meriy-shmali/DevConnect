import React from "react";
import App from "./App.jsx";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom"; 
/*import { useNotificationLogic } from "./hook/useNotificationLogic"; // استيراد اللوجيك الخاص بكِ*/
import Welcomepage from "./components/Welcomepage.jsx";
import CreatepostMobile from "./components/Feed/CreatepostMobile.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
import Login from "./components/login/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AccountSetting from "./components/AccountSetting.jsx/AccountSetting.jsx";
import Header from "./components/Notification.jsx/Header.jsx"; // 🟢 التأكد من استيراد الهيدر هنا
import ChangePassword from "./components/ChangePassword.jsx/ChangePassword.jsx";
import ProfilePage from "./components/Profile.jsx/ProfilePage.jsx";
import EditPostModal from "./components/Profile.jsx/EditPostModal.jsx";
import MainPostPage from "./components/Search.jsx/MainPostPage";
import SavedPage from "./components/AccountSetting.jsx/SavedPage";

// 🟢 1. إنشاء الـ Layout المشترك للمسارات المحمية ليظهر الهيدر بها جميعاً مرة واحدة
const ProtectedLayout = () => {
  return (
    <>
      <Header /> {/* سيثبت الهيدر هنا في أعلى كل الصفحات المحمية */}
      <Outlet /> {/* هنا سيتم عرض المكون الخاص بالصفحة الحالية تلقائياً وبشكل سلس */}
    </>
  );
};

const PublicRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const token = localStorage.getItem("access");

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-main-background text-white">Loading...</div>;
  }
  
  if (token && currentUser) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (!isExpired) {
        return <Navigate to="/feed" replace />;
      }
    } catch {
      // التوكن غير صالح أو تالف
    }
  }
  
  return children;
};

const PrivateRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const token = localStorage.getItem("access");

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-main-background text-white">Loading...</div>;
  }

  if (!token || !currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      // 🟢 المسارات العامة (بدون هيدر)
      {
        path: "", 
        element: <PublicRoute><Welcomepage /></PublicRoute>,
      },
      {
        path: "login",
        element: <PublicRoute><Login /></PublicRoute>,
      },
      {
        path: "register",
        element: <PublicRoute><Register /></PublicRoute>,
      },
      
      // 🟢 جمع كل المسارات المحمية التي تحتاج الهيدر داخل مجموعة واحدة تحت الـ Layout الجديد
      {
        element: <PrivateRoute><ProtectedLayout /></PrivateRoute>,
        children: [
          {
            path: "feed",
            element: <Feed />,
          },
           {
      path: "post/:id",
      element: <MainPostPage />,
    },
          {
            path: "post-mobile",
            element: <CreatepostMobile />,
          },
          {
            path: "change",
            element: <ChangePassword />,
          },
          {
            path: "account",
            element: <AccountSetting />,
          },
          {
            path: "saved-posts",
            element: <SavedPage />,
          },
          {
            path: "profile/:id",
            element: <ProfilePage />,
          },
          {
            path: "profile/me",
            element: <ProfilePage />,
          },
          {
            path: "edit-post/:id",
            element: <EditPostModal />,
          },
        ]
      }
    ]
  }
]);

export default router;
  
   
      
  