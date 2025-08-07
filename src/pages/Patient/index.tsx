import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type PatientsType = {
  id: string;
  name: string;
  age: string;
  gender: string;
  lastAppointment: string;
  nextAppointment: string | null;
  status: string;
};

export default function Patient() {
  const { id } = useParams();
  const [patients, setPatients] = useState<PatientsType>({
    id: "",
    name: "",
    age: "",
    gender: "",
    lastAppointment: "",
    nextAppointment: "",
    status: "",
  });

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`http://localhost:3000/patients/${id}`, {
          method: "GET",
        });
        if (!response.ok) throw new Error("Resposta inválida da API");
        const data: PatientsType = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }

    fetchPatients();
  }, [id]);

  return (
    <div>
      <ul>
        <li>id: {patients.id}</li>
        <li>Nome: {patients.name}</li>
        <li>Idade: {patients.age}</li>
        <li>Genero: {patients.gender}</li>
        <li>Ultimo atendimento: {patients.lastAppointment}</li>
        <li>Proximo atendimento: {patients.nextAppointment}</li>
        <li>Status: {patients.status}</li>
      </ul>
    </div>
  );
}
