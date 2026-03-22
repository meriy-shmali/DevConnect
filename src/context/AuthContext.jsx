import React, { createContext, useContext, useState } from "react";

// 1. إنشاء الـ Context
const AuthContext = createContext();

// 2. Provider لتغليف التطبيق
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // رح يحتوي بيانات المستخدم بعد تسجيل الدخول

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook لاستخدام الـ Context بسهولة
export const useAuth = () => useContext(AuthContext);
