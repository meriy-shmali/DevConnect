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
      if (value === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // 👇 دعم system mode live
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");

      const handler = (e) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      media.addEventListener("change", handler);

      return () => media.removeEventListener("change", handler);
    }

  }, [theme]);

  return { theme, setTheme };
};