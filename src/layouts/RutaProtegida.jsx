import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header";

const RutaProtegida = () => {
  const { auth, cargando, usuario } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (cargando) return "Cargando...";

  return (
    <>
      {auth.token && usuario ? (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default RutaProtegida;
