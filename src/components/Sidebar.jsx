import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaChartLine, FaCogs, FaBell, FaEnvelope, FaClipboardList, FaSignOutAlt, FaCalendar, FaRegistered, FaDatabase, FaShieldVirus, FaTools, FaChartArea, FaFileArchive, FaFileCsv } from 'react-icons/fa';
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "../assets/images/LogoPlataformaBlanco.png";
import useAuth from "../hooks/useAuth";
import { FaFileContract, FaHouse } from "react-icons/fa6";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const menuItems = [
    { to: "/panel", icon: <FaHouse style={{ fontSize: "20px" }}/>, label: "Home" },
    { to: "/panel/calendar", icon: <FaCalendar style={{ fontSize: "20px" }}/>, label: "Calendario" },
    { to: "/panel/forms", icon: <FaClipboardList style={{ fontSize: "20px" }}/>, label: "Registros" },
    { to: "/panel/tables", icon: <FaDatabase style={{ fontSize: "20px" }}/>, label: "Datos" },
    { to: "/panel/enfermedades", icon: <FaShieldVirus style={{ fontSize: "20px" }}/>, label: "Enfermedades" },
    { to: "/panel/settings", icon: <FaCogs style={{ fontSize: "20px" }}/>, label: "Configuración" },
    { to: "/panel/chart", icon: <FaFileContract style={{ fontSize: "20px" }}/>, label: "Reportes" },
    { to: "/", icon: <FaSignOutAlt style={{ fontSize: "20px" }}/>, label: "Cerrar Sesión", action: logout },
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} width={200} height={80} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625"
            />
          </svg>
        </button>
      </div>

      {/* <!-- SIDEBAR MENU --> */}
      <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-6 lg:pb-6.5">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={`flex items-center gap-4 px-3 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-400 ${pathname === item.to ? "active-link" : ""}`}
            onClick={item.action ? item.action : null}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
