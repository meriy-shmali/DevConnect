import { useEffect, useState } from "react";

export const UseTheme = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return 'system';
  };

  const [theme, _setTheme] = useState(getInitialTheme);

  // 🌟 تعديل التابع ليدعم أنيميشن التمدد الدائري الاحترافي
  const setTheme = (newTheme) => {
    // إذا كان المتصفح لا يدعم الخاصية الحديثة، نغير الثيم بشكل طبيعي
    if (!document.startViewTransition) {
      _setTheme(newTheme);
      return;
    }

    // إطلاق أنيميشن الانتقال
    document.startViewTransition(() => {
      _setTheme(newTheme);
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (value) => {
      if (value === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      } else if (value === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }

  }, [theme]);

  return { theme, setTheme };
};