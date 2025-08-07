import { useEffect, useState } from "react";
import { SearchInput } from "../../components/SearchInput";
import { Card } from "../../components/Card";

type PatientsType = {
  id: string;
  name: string;
  age: string;
};

export default function Home() {
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
          console.error("Resposta invalida da API", data);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }

    fetchPatients();
  }, []);

  return (
    <div className="flex flex-col justify-center gap-10 w-full py-5">
      <div>
        <h1 className="text-center font-medium text-3xl">Olá, Dr. Deyvid</h1>
      </div>
      <div>
        <SearchInput />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex grid-cols-2 gap-5 px-10">
          <Card width="w-full" height="h-full">
            <h2 className="font-semibold text-lg">
              Lista de pacientes para atender
            </h2>
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col gap-2 border-b-1 border-b-gray-400"
              >
                <p>{patient.name}</p>
                <p className="font-light text-zinc-600">{patient.age}</p>
              </div>
            ))}
          </Card>
          <div className="flex flex-col gap-5">
            <Card height="h-60">
              <h3>Pacientes cadastros</h3>
              <span className="text-5xl mt-2">{patients.length}</span>
            </Card>
            <Card height="h-full">
              <h3>Atendimentos hoje</h3>
              <span className="text-5xl mt-20">{patients.length}</span>
            </Card>
          </div>
        </div>
        <div className="px-10 pb-5">
          <Card width="w-full" height="h-full">
            <h2 className="font-semibold text-lg">
              Ultimos prontuarios acessados
            </h2>
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col gap-2 border-b-1 border-b-gray-400"
              >
                <p>{patient.name}</p>
                <p className="font-light text-zinc-600">{patient.age}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
