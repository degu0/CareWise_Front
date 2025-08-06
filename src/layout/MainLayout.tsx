import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu";

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0">
        <Menu />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};