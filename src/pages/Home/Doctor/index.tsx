import { useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

type PatientsType = {
  id: string;
  name: string;
  yearOfBirth: string;
};

export default function HomeDoctor() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [patients, setPatients] = useState<PatientsType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPatients() {
      try {
        ///Trocar patients para queue
        const response = await fetch(`${API_URL}/patients`, {
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
  }, [API_URL]);

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

  const updatePatientStatus = (id: string) => {
    alert(`${id} update`);
    // async function patchQueue() {
    //   try {
    //     const response = await fetch(`${API_URL}/queue/${id}`, {
    //       method: "PATCH",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ newStatus: "atendido" }),
    //     });

    //     if (!response.ok) throw new Error("Erro ao atualizar status do paciente");

    //     const updatedData: PatientsType[] = await response.json();
    //     setPatients(updatedData);
    //     setFilteredPatients(updatedData);

    //     alert(`Paciente ${id} atualizado para "atendido"`);
    //   } catch (error) {
    //     console.error("Erro ao atualizar paciente:", error);
    //   }
    // }

    // patchQueue();
  };
  return (
    <div className="flex flex-col gap-10 w-full py-10 px-5 md:px-10">
      <h1 className="text-center font-bold text-3xl md:text-4xl text-zinc-800">
        Olá, Dr. Deyvid
      </h1>
      <div className="flex justify-between gap-15">
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
                className="flex items-center justify-between p-3 border-b border-zinc-200 hover:bg-zinc-50 transition-colors rounded cursor-pointer"
                onClick={() => handleNavigateChat(patient.id, patient.name)}
              >
                <div>
                  {" "}
                  <p className="font-medium text-zinc-800">{patient.name}</p>
                  <p className="text-sm text-zinc-500">
                    {ageCalculate(patient.yearOfBirth)} anos
                  </p>
                </div>
                <div
                  className="mr-5 text-teal-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    updatePatientStatus(patient.id);
                  }}
                >
                  <FaCheck />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card
            width="0"
            className="p-10 bg-teal-50 shadow-lg rounded-lg flex flex-col justify-around"
          >
            <h3 className="text-zinc-700 font-semibold">
              Pacientes para ser atendido
            </h3>{" "}
            <span className="text-7xl font-bold mt-2 text-teal-700">
              {patients.length}
            </span>
          </Card>
          <Card
            width="100"
            className="p-10 bg-green-50 shadow-lg rounded-lg flex flex-col justify-around"
          >
            <h3 className="text-zinc-700 font-semibold">
              Total de pacientes atendidos
            </h3>
            <span className="text-7xl font-bold mt-2 text-green-700">
              {patients.length - 2}
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
