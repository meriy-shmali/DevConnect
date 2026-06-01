import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 🌟 أضفنا حالة تحميل لانتظار الفحص

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          // التوكن منتهي الصلاحية → نظّف localStorage وعامل المستخدم كزائر
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setCurrentUser(null);
        } else {
          setCurrentUser({ loggedIn: true });
        }
      } catch {
        // التوكن تالف أو غير صالح
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
