import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Welcomepage from "./components/Welcomepage.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
import EditPostModal from "./components/EditPostModal.jsx";
import AccountSetting from "./components/AccountSetting.jsx/AccountSetting.jsx";
import Header from "./components/Notification.jsx/Header.jsx";
import ChangePassword from "./components/ChangePassword.jsx/ChangePassword.jsx";
import ProfilePage from "./components/Profile.jsx/ProfilePage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcomepage,
  },
  {
    path:'/register',
    Component:Register,
  },
  {
    path:'/feed',
    Component:Feed,
  },
  {
    path: "/test-edit",
    Component:EditPostModal,
  },
   //{
    //path: "/account",
    //Component: Accounts,
  //},
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
    path: "/profile/:username",
    Component: ProfilePage,
  },
]);

export default router;