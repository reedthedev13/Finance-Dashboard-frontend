// src/components/Layout.jsx
import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Header bar spans full width */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 shadow-sm w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Header />
          <DarkModeToggle
            toggle={() => setDarkMode(!darkMode)}
            isDark={darkMode}
          />
        </div>
      </header>

      {/* Main content fills full screen width but centers content */}
      <main className="flex-grow w-full">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* Optional footer (if you want spacing at bottom) */}
      <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Finance Dashboard
      </footer>
    </div>
  );
};

export default Layout;
