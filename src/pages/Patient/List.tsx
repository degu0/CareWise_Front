import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalFilter } from "../../components/ModalFilter";
import { SearchInput } from "../../components/SearchInput";
import { FaCheck } from "react-icons/fa";

type PatientsType = {
  id: string;
  name: string;
  yearOfBirth: string;
  gender: string;
  cpf: string;
};

export default function PatientList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientsType[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientsType[]>([]);
  const [filters, setFilters] = useState<{
    gender?: string;
    age?: string;
    disease?: string;
  }>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${API_URL}/patients`);
        const data: PatientsType[] = await response.json();
        if (Array.isArray(data)) {
          setPatients(data);
          setFilteredPatients(data);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }
    fetchPatients();
  }, [API_URL]);

  const ageCalculate = (yearOfBirth: string) => {
    const today = new Date();
    const birth = new Date(yearOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);

    const filtered = patients.filter((p) => {
      const matchGender = newFilters.gender
        ? p.gender === newFilters.gender
        : true;

      const patientAge = ageCalculate(p.yearOfBirth);

      const matchAge = newFilters.age
        ? (() => {
            switch (newFilters.age) {
              case "<18":
                return patientAge < 18;
              case "18-25":
                return patientAge >= 18 && patientAge <= 25;
              case "26-40":
                return patientAge >= 26 && patientAge <= 40;
              case "41-69":
                return patientAge >= 41 && patientAge <= 69;
              case "70+":
                return patientAge >= 70;
              default:
                return true;
            }
          })()
        : true;


      const matchQuery = newFilters.query
        ? p.name.toLowerCase().includes(newFilters.query.toLowerCase())
        : true;

      return matchGender && matchAge && matchQuery;
    });

    setFilteredPatients(filtered);
  };

  const handleCellClick = (id: string) => navigate(`/paciente/${id}`);

  const handleRegisterInQueue = (id: string) => {
    alert(`Voce adicionou ${id} para fila de espera`);


    // async function fetchRegisterPatientInQueue() {
    //   try {
    //     const response = await fetch(`${API_URL}/patients/${id}`, {
    //       method: "PATCH", // ou "POST" se seu endpoint for POST
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ inQueue: true }), // adiciona o paciente na fila
    //     });

    //     if (!response.ok) throw new Error("Erro ao adicionar paciente à fila");

    //     const updatedPatient: PatientsType = await response.json();

    //     // Atualiza estados com os dados recebidos do backend
    //     setPatients((prev) =>
    //       prev.map((p) => (p.id === id ? updatedPatient : p))
    //     );
    //     setFilteredPatients((prev) =>
    //       prev.map((p) => (p.id === id ? updatedPatient : p))
    //     );

    //     alert(`Você adicionou ${updatedPatient.name} para a fila de espera`);
    //     navigate(`/paciente/formulario/${id}`)
    //   } catch (error) {
    //     console.error("Erro ao registrar paciente na fila:", error);
    //     alert("Erro ao registrar paciente na fila");
    //   }
    // }
  };

  return (
    <div className="w-full h-screen px-10 py-5 flex flex-col gap-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
        {parsedUser?.role === "nurse" ? (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 transition"
            onClick={() => navigate("/paciente/cadastro")}
            title="Cadastrar novo paciente"
          >
            Cadastrar paciente
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <div className="flex-1 max-w-6xl">
          <SearchInput
            onSearch={(term) => applyFilters({ ...filters, query: term })}
          />
        </div>
        <button
          className="bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg px-5 py-2.5 transition"
          onClick={() => setShowModal(true)}
        >
          Filtrar
        </button>
        {showModal && (
          <ModalFilter
            close={() => setShowModal(false)}
            onApply={(newFilters) =>
              applyFilters({ ...filters, ...newFilters })
            }
          />
        )}
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center text-xl font-medium">
          Nenhum dado encontrado
        </div>
      ) : (
        <div className="relative z-0 overflow-x-auto shadow-md sm:rounded-lg overflow-y-auto">
          <table className="w-full text-sm text-left text-zinc-700">
            <thead className="text-sm uppercase bg-zinc-100 sticky top-0 z-10">
              <tr>
                <th className="text-center py-3">Nome</th>
                <th className="text-center py-3">Idade</th>
                <th className="text-center py-3">Gênero</th>
                <th className="text-center py-3">CPF</th>
                {parsedUser?.role === "nurse" ? (
                  <th className="text-center py-3">Ações</th>
                ) : (
                  ""
                )}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-zinc-50 transition-colors text-sm text-center cursor-pointer"
                  onClick={() => handleCellClick(p.id)}
                >
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{ageCalculate(p.yearOfBirth)}</td>
                  <td className="px-6 py-4">{p.gender}</td>
                  <td className="px-6 py-4">{p.cpf}</td>
                  {parsedUser?.role === "nurse" ? (
                    <td
                      className="px-10 py-4 flex justify-center items-center text-teal-500"
                      onClick={(e) => { e.stopPropagation(); handleRegisterInQueue(p.id);}}
                    >
                      <FaCheck title="Adicionar paciente à fila de espera" />
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
