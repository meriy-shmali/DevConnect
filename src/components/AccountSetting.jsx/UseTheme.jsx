import { useEffect, useState } from "react";

export const UseTheme = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return 'system';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (value) => {
      // 👈 التعديل هنا: إذا كان الخيار سستم، يفحص المتصفح فوراً هل هو دارك أم لا
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

    // تطبيق الثيم فوراً عند تغير الاختيار أو تحميل الصفحة
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // دعم مراقبة تغيير ثيم النظام المباشر (Live)
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");

      const handler = (e) => {
        // عندما يتغير ثيم الجهاز أثناء تصفح المستخدم للموقع
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