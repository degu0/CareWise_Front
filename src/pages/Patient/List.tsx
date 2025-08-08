import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownSelect } from "../../components/Dropdown";

type PatientsType = {
  id: string;
  name: string;
  yearOfBirth: string;
  gender: string;
  cpf: string;
  unimedCard: string;
  address: string;
  phone: string;
  city: string;
  state: string;
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

  function ageCalculate(yearOfBirth: string): number {
    const today = new Date();
    const birth = new Date(yearOfBirth);

    let age = today.getFullYear() - birth.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const birthMonth = birth.getMonth();
    const birthDay = birth.getDate();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  }

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
          <h2 className="font-medium text-xl text-center">
            Nenhum dado encontrado
          </h2>
        </div>
      ) : (
        <div className="relative z-0 overflow-x-auto shadow-md sm:rounded-lg overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-sm uppercase bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Idade</th>
                <th className="px-6 py-3">Gênero</th>
                <th className="px-6 py-3">CPF</th>
                <th className="px-6 py-3">Numero da Carterinha</th>
                <th className="px-6 py-3">Endereço</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3">Cidade</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50 transition-colors text-sm text-center cursor-pointer"
                  onClick={() => handleCellClick(p.id)}
                >
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{ageCalculate(p.yearOfBirth)}</td>
                  <td className="px-6 py-4">{p.gender}</td>
                  <td className="px-6 py-4">{p.cpf}</td>
                  <td className="px-6 py-4">{p.unimedCard}</td>
                  <td className="px-6 py-4">{p.address}</td>
                  <td className="px-6 py-4">{p.phone}</td>
                  <td className="px-6 py-4">{p.city}</td>
                  <td className="px-6 py-4">{p.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
