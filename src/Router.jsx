import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom"; // أضفنا Outlet
import { useNotificationLogic } from "./hook/useNotificationLogic"; // استيراد اللوجيك الخاص بكِ

// 1. إنشاء مكون مغلف لتفعيل الإشعارات في كل مكان
const RootLayout = () => {
  useNotificationLogic(); // تفعيل المستمع هنا ليعمل في كل المسارات
  return <Outlet />;      // هذا سيقوم بعرض المكونات (Feed, Profile, etc.)
};

import Welcomepage from "./components/Welcomepage.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
import Login from "./components/login/Login.jsx";
import AccountSetting from "./components/AccountSetting.jsx/AccountSetting.jsx";
import Header from "./components/Notification.jsx/Header.jsx";
import ChangePassword from "./components/ChangePassword.jsx/ChangePassword.jsx";
import ProfilePage from "./components/Profile.jsx/ProfilePage.jsx";
import EditPostModal from "./components/Profile.jsx/EditPostModal.jsx";
import PostPage from "./components/Search.jsx/PostPage.jsx";

const router = createBrowserRouter([
  {
    // 2. نجعل جميع المسارات تتبع للـ RootLayout
    path: "/",
    element: <RootLayout />, 
    children: [
      {
        path: "/",
        Component: Welcomepage,
      },
      {
        path: '/register',
        Component: Register,
      },
      {
        path: '/feed',
        Component: Feed,
      },
      {
        path: '/login',
        Component: Login,
      },
      {
        path: "/edit-post/:id",
        Component: EditPostModal,
      },
      {
        path: "/header",
        Component: Header,
      },
      {
        path: "/change",
        Component: ChangePassword,
      },
      {
        path: "/account",
        Component: AccountSetting,
      },
      {
        path: "/profile/me",
        Component: ProfilePage,
      },
      {
        path: "/profile/:username",
        Component: ProfilePage,
      },
      {
        path: "/posts/:id",
        Component: PostPage,
      },
    ]
  }
]);

export default router;