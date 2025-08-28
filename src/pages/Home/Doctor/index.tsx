import { useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import { useNavigate } from "react-router-dom";

type PatientsType = {
  id: string;
  name: string;
  yearOfBirth: string;
};

export default function HomeDoctor() {
  const [patients, setPatients] = useState<PatientsType[]>([]);
  const navigate = useNavigate();

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

  const handleNavigateChat = (id: string, name: string) => {
    localStorage.setItem("patient", JSON.stringify({ id, name }));
    navigate("/chat");
  };

  return (
    <div className="flex flex-col gap-10 w-full py-10 px-5 md:px-10">
      <h1 className="text-center font-bold text-3xl md:text-4xl text-gray-800">
        Olá, Dr. Deyvid
      </h1>
      <div className="flex justify-between">
        <Card
          width="120"
          height="100"
          className="col-span-2 p-5 bg-white shadow-lg rounded-lg w-[75%]"
        >
          <h2 className="font-semibold text-xl mb-4">
            Lista de pacientes para atender
          </h2>
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded"
                onClick={() => handleNavigateChat(patient.id, patient.name)}
              >
                <p className="font-medium text-gray-800">{patient.name}</p>
                <p className="text-sm text-gray-500">
                  {ageCalculate(patient.yearOfBirth)} anos
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-5 bg-blue-50 shadow-lg rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-gray-700 font-semibold">
              Pacientes cadastrados
            </h3>
            <span className="text-4xl font-bold mt-2 text-blue-700">
              {patients.length}
            </span>
          </Card>
          <Card className="p-5 bg-green-50 shadow-lg rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-gray-700 font-semibold">Atendimentos hoje</h3>
            <span className="text-4xl font-bold mt-2 text-green-700">
              {patients.length}
            </span>
          </Card>
        </div>
      </div>

      <Card width="200" className="p-5 bg-white shadow-lg rounded-lg">
        <h2 className="font-semibold text-xl mb-4">
          Últimos prontuários acessados
        </h2>
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="flex flex-col p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded"
            >
              <p className="font-medium text-gray-800">{patient.name}</p>
              <p className="text-sm text-gray-500">
                {ageCalculate(patient.yearOfBirth)} anos
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
