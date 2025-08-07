import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-gray-100">
      <header className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        {/* Header perfectly centered on all screen sizes */}
        <div className="w-full flex justify-center text-center">
          <Header />
        </div>
        {/* Toggle right-aligned on desktop, centered on mobile */}
        <div className="flex justify-center sm:justify-end">
          <DarkModeToggle
            toggle={() => setDarkMode(!darkMode)}
            isDark={darkMode}
          />
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
