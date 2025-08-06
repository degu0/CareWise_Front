import { useEffect, useState } from "react";
import { Table, type Column } from "../../components/Table";

type PatientsType = {
  id: string;
  name: string;
  age: string;
  gender: string;
  lastAppointment: string;
  nextAppointment: string | null;
  status: string;
};

export default function PatientList() {
  const [patients, setPatients] = useState<PatientsType[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/patients", {
          method: "GET",
        });
        const data: PatientsType[] = await response.json();

        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          console.error("Resposta inválida da API", data);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }

    fetchPatients();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não agendado";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const columns: Column<PatientsType>[] = [
    { key: "name", label: "Nome do Paciente" },
    { key: "age", label: "Idade" },
    { key: "gender", label: "Gênero" },
    {
      key: "lastAppointment",
      label: "Última Consulta",
      render: (p) => formatDate(p.lastAppointment),
    },
    {
      key: "nextAppointment",
      label: "Próxima Consulta",
      render: (p) => formatDate(p.nextAppointment),
    },
    {
      key: "status",
      label: "Status",
      render: (p) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            p.status === "Saudável"
              ? "bg-green-100 text-green-800"
              : p.status === "Emergência"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {p.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-screen px-10 py-5">
      <h1 className="text-lg font-semibold mb-4">Lista de Pacientes</h1>
      <Table data={patients} columns={columns} />
    </div>
  );
}
