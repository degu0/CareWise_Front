import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationsProps = {
  id: string;
  patients: string;
  context: string;
  message: string;
  status: string;
  dataOfMesage: string;
};

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [drawerStep, setDrawerStep] = useState<"main" | "details">("main");
  const [notifications, setNotifications] = useState<NotificationsProps[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationsProps | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`${API_URL}/notifications`);
        const data: NotificationsProps[] = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.log("Erro na busca de dados", error);
      }
    }
    fetchNotifications();
  }, [API_URL]);

  const closeDrawer = () => {
    setDrawerStep("main");
    setSelectedNotification(null);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl rounded-l-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-800">
            {drawerStep === "main"
              ? "Notificações"
              : "Detalhes da Notificação"}
          </h2>
          <button
            onClick={closeDrawer}
            className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <IoCloseSharp size={22} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {drawerStep === "main" && (
            <div className="flex flex-col gap-2">
              {notifications.length === 0 ? (
                <p className="text-zinc-500">Nenhuma notificação disponível.</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-colors shadow-sm"
                    onClick={() => {
                      setSelectedNotification(notification);
                      setDrawerStep("details");
                    }}
                  >
                    <p className="text-zinc-800 font-medium">
                      Nova mensagem sobre <span className="font-semibold">{notification.patients}</span>
                    </p>
                    <p className="text-zinc-500 text-sm truncate">
                      {notification.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {drawerStep === "details" && selectedNotification && (
            <div className="flex flex-col gap-3">
              <div className="space-y-1 text-zinc-600">
                <p>
                  <strong>Paciente:</strong> {selectedNotification.patients}
                </p>
                <p>
                  <strong>Mensagem:</strong> {selectedNotification.message}
                </p>
                <p>
                  <strong>Contexto:</strong> {selectedNotification.context}
                </p>
                <p>
                  <strong>Status:</strong> {selectedNotification.status}
                </p>
                <p>
                  <strong>Data:</strong> {selectedNotification.dataOfMesage}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setDrawerStep("main");
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Enviar
                </button>
                <button
                  onClick={() => {
                    setDrawerStep("main");
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

