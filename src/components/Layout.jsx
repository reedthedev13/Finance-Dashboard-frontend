import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 font-sans">
      <Header />
      <main className="p-4 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
