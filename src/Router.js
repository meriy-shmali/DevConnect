import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Welcomepage from "./components/Welcomepage.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
import CreatepostMobile from "./components/Feed/CreatepostMobile.jsx";
import ProfilePeople from "./components/Feed/ProfilePeople/ProfilePeople.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcomepage,
  },
  {
    path: "/login",
    Component: Login,
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
    path:'/post-mobile',
    Component:CreatepostMobile
  },
  {
    path:'/profile/:id',
    Component:ProfilePeople
  }
 
]);

export default router;