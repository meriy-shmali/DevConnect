import React, { createContext, useContext, useState,useEffect } from "react";
import jwtDecode from 'jwt-decode';
// 1. إنشاء الـ Context
const AuthContext = createContext();

// 2. Provider لتغليف التطبيق
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // رح يحتوي بيانات المستخدم بعد تسجيل الدخول
  //مشان ما يختفي المستخدم لما اعمل refresh
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // التحقق من صلاحية التوكن (اختياري)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.clear();
          setCurrentUser(null);
        } else {
          setCurrentUser(decoded);
        }
      } catch {
    
        localStorage.clear();
      }
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook لاستخدام الـ Context بسهولة
export const useAuth = () => useContext(AuthContext);
