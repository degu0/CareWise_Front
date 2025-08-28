import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaUserPlus,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/logo_branca.png";
import { AuthContext } from "../context/AuthContextProvider";

export const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-22" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl px-2 py-1 rounded hover:bg-gray-700"
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
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <FaHome />
            {!collapsed && <span>Home Médico</span>}
          </Link>
        ) : (
          <Link
            to="/enfermeira"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <FaHome />
            {!collapsed && <span>Home Enfermeira</span>}
          </Link>
        )}

        <Link
          to="/paciente/lista"
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
        >
          <FaUserFriends />
          {!collapsed && <span>Lista de Pacientes</span>}
        </Link>

        {userData.role === "nurse" && (
          <Link
            to="/paciente/cadastro"
            className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <FaUserPlus />
            {!collapsed && <span>Cadastrar Paciente</span>}
          </Link>
        )}

        {userData.role === "doctor" && (
          <>
            <Link
              to="/prontuario/1"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <FaUserPlus />
              {!collapsed && <span>Prontuário</span>}
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <FaChartPie />
              {!collapsed && <span>Chat</span>}
            </Link>
          </>
        )}

        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-700 transition"
        >
          <FaChartPie />
          {!collapsed && <span>Dashboard</span>}
        </Link>
      </div>

      <div className="border-t border-gray-700 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};
