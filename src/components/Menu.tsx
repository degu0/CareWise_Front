import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_branca.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

import { FaHome } from "react-icons/fa";
import { MdPeopleAlt, MdLogout } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";

export const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    navigate("/login");
    logout();
  };

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b border-gray-700">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold">CareWise</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
          <Link
            to="/paciente/lista"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <MdPeopleAlt className="text-lg" />
            <span>Lista de Pacientes</span>
          </Link>
          <Link
            to="/paciente/cadastro"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <MdPeopleAlt className="text-lg" />
            <span>Cadastrar paciente</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RiDashboardFill className="text-lg" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
        >
          <MdLogout className="text-lg" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};
