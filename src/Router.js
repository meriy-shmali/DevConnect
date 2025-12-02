import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Welcomepage from "./components/Welcomepage.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
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
  }
]);

export default router;