import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Header from "./Header"; // import your Header
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
      <header className="p-4 flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <Header />
        </div>
        <div>
          <DarkModeToggle
            toggle={() => setDarkMode(!darkMode)}
            isDark={darkMode}
          />
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
