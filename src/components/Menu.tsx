import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import logo from "../assets/logo_branca.png";
import { AuthContext } from "../context/AuthContextProvider";
import { Drawer } from "./DrawerNotication";

export const Menu = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [lengthNotifications, setLengthNotifications] = useState<number>(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`${API_URL}/notifications`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const unreadNotifications = data.filter(
            (notification) => !notification.isReviewedByDoctor
          );
          setLengthNotifications(unreadNotifications.length);
        }
      } catch (error) {
        console.log("Erro na busca de dados", error);
      }
    }

    fetchNotifications();
  }, [API_URL]);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen bg-green-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-22" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-300">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl px-2 py-1 rounded cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-10 h-10" />
            {!collapsed && <h1 className="text-lg font-bold">CareWise</h1>}
          </div>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1 p-5">
        {userData.role === "doctor" ? (
          <Link
            to="/medico"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            <FaHome />
            {!collapsed && <span>Home</span>}
          </Link>
        ) : (
          <Link
            to="/enfermeira"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            <FaHome />
            {!collapsed && <span>Home</span>}
          </Link>
        )}

        <Link
          to="/paciente/lista"
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          <FaUserFriends />
          {!collapsed && <span>Lista de Pacientes</span>}
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          <FaChartPie />
          {!collapsed && <span>Dashboard</span>}
        </Link>
      </div>

      <div className="border-t border-zinc-300 p-6">
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex items-center gap-3 w-full p-3 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          <div className="relative">
            <IoNotifications size={20} />
            {lengthNotifications > 0 && (
              <span className="absolute -top-2 -right-2 text-xs w-4.5 h-4.5 flex items-center justify-center rounded-full bg-red-500 text-white">
                {lengthNotifications}
              </span>
            )}
          </div>
          {!collapsed && <span>Notificações</span>}
        </button>
        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 mt-4 rounded-lg hover:bg-red-500 transition cursor-pointer"
        >
          <FaSignOutAlt size={22} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};
