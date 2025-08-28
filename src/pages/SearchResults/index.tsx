import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function SearchResult() {
  const { value } = useParams();
  const [patients, setPatients] = useState<PatientsType[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`http://localhost:3000/patients/${value}`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Resposta inválida da API");
        const data: PatientsType = await response.json();

        setPatients([data]);
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }

    fetchPatients();
  }, [value]);

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
              : "bg-teal-100 text-teal-800"
          }`}
        >
          {p.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-screen px-10 py-5">
      <h1 className="text-lg font-semibold mb-4">Resultado da Pesquisa</h1>
      <Table data={patients} columns={columns} />
    </div>
  );
}
