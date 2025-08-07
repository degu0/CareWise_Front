import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownSelect } from "../../components/Dropdown";

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
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [patients, setPatients] = useState<PatientsType[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientsType[]>([]);

  const [filteringByGender, setFilteringByGender] = useState<string>("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/patients");
        const data: PatientsType[] = await response.json();

        if (Array.isArray(data)) {
          setPatients(data);
          setFilteredPatients(data);
        } else {
          console.error("Resposta inválida da API", data);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }

    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = patients.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const handleSelectChange = (item: string) => {
    setFilteringByGender(item);

    const filtered = patients.filter((patient) => {
      const matchGender = item ? patient.gender === item : true;
      const matchName = query
        ? patient.name.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchGender && matchName;
    });

    setFilteredPatients(filtered);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não agendado";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleCellClick = (id: string) => {
    navigate(`/paciente/${id}`);
  };

  return (
    <div className="w-full h-screen px-10 py-5 flex flex-col gap-5">
      <h1 className="text-lg font-semibold mb-4">Lista de Pacientes</h1>
      <div className="w-full max-w-4xl">
        <input
          type="text"
          placeholder="Pesquise o nome da loja"
          value={query}
          onChange={handleInputChange}
          className="border-2 border-none rounded text-black w-full p-3 bg-white shadow"
        />
      </div>
      <div>
        <DropdownSelect
          data={["Masculino", "Feminino"]}
          onSelect={handleSelectChange}
        />
      </div>
      {filteredPatients.length === 0 ? (
        <div>
          <h2 className="font-medium text-xl text-center">Nenhum dado encontrado</h2>
        </div>
      ) : (
        <div className="relative z-0 overflow-x-auto shadow-md sm:rounded-lg max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Nome do Paciente</th>
                <th className="px-6 py-3">Idade</th>
                <th className="px-6 py-3">Gênero</th>
                <th className="px-6 py-3">Última Consulta</th>
                <th className="px-6 py-3">Próxima Consulta</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                  onClick={() => handleCellClick(p.id)}
                >
                  <td className="px-6 py-4 cursor-pointer">{p.name}</td>
                  <td className="px-6 py-4 cursor-pointer">{p.age}</td>
                  <td className="px-6 py-4 cursor-pointer">{p.gender}</td>
                  <td className="px-6 py-4 cursor-pointer">
                    {formatDate(p.lastAppointment)}
                  </td>
                  <td className="px-6 py-4 cursor-pointer">
                    {formatDate(p.nextAppointment)}
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
