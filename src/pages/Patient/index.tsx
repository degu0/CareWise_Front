import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export default function Patient() {
  const { id } = useParams();
  const [patients, setPatients] = useState<PatientsType>({
    id: "",
    name: "",
    yearOfBirth: "",
    gender: "",
    cpf: "",
    unimedCard: "",
    address: "",
    phone: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`http://localhost:3000/patients?id=${id}`);
        if (!response.ok) throw new Error("Resposta inválida da API");
        const data: PatientsType[] = await response.json();
        setPatients(data[0]);
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }
    fetchPatients();
  }, [id]);

  function ageCalculate(yearOfBirth: string): number {
    const today = new Date();
    const birth = new Date(yearOfBirth);

    let age = today.getFullYear() - birth.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const birthMonth = birth.getMonth();
    const birthDay = birth.getDate();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }

    return age;
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6 flex flex-col gap-6">
      <div className="w-full px-5 py-3 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-zinc-800">{patients.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-zinc-700 font-medium">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="block text-sm text-zinc-500">Idade</span>
            <span className="text-lg">{ageCalculate(patients.yearOfBirth)}</span>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="block text-sm text-zinc-500">Sexo</span>
            <span className="text-lg">{patients.gender}</span>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="block text-sm text-zinc-500">CPF</span>
            <span className="text-lg">{patients.cpf}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-zinc-700 font-medium">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="block text-sm text-zinc-500">Telefone</span>
            <span className="text-lg">{patients.phone}</span>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="block text-sm text-zinc-500">Endereço</span>
            <span className="text-lg">
              {patients.address} - {patients.city}, {patients.state}
            </span>
          </div>
        </div>
      </div>

      <div className=" p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-zinc-800">Histórico de Diagnósticos</h2>
        <div className="bg-white p-4 rounded-md shadow-sm text-zinc-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae aspernatur amet asperiores impedit suscipit similique repellat dolorum repellendus ab commodi, incidunt labore laborum nobis laudantium cupiditate quibusdam dolore provident itaque?
        </div>
      </div>
    </div>
  );
}
