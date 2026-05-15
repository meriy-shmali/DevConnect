import React from "react";
import { createBrowserRouter,Navigate } from "react-router-dom";
import Welcomepage from "./components/Welcomepage.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Feed from "./components/Feed/Feed.jsx";
import CreatepostMobile from "./components/Feed/CreatepostMobile.jsx";
import ProfilePeople from "./components/Feed/ProfilePeople/ProfilePeople.jsx";
// إذا في توكن → روح على Feed
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  if (token) return <Navigate to="/feed" replace />;
  return children;
};

// إذا ما في توكن → روح على Welcome
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/" replace />;
  return children;
};
const router = createBrowserRouter([
   {
    path: "/",
    element: <PublicRoute><Welcomepage /></PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>,
  },
  {
    path: "/feed",
    element: <PrivateRoute><Feed /></PrivateRoute>,
  },
  {
    path: "/post-mobile",
    element: <PrivateRoute><CreatepostMobile /></PrivateRoute>,
  },
  {
    path: "/profile/:id",
    element: <PrivateRoute><ProfilePeople /></PrivateRoute>,
  }
 
]);

export default router;