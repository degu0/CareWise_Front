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
        const response = await fetch(
          `http://localhost:3000/patients?id=${id}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) throw new Error("Resposta inválida da API");
        const data: PatientsType = await response.json();
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

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  }

  return (
    <div>
      <ul>
        <li className="flex flex-col">
          <span>Nome:</span> <span>{patients.name}</span>
        </li>
        <li>Idade: {ageCalculate(patients.yearOfBirth)}</li>
        <li>Genero: {patients.gender}</li>
        <li>CPF: {patients.cpf}</li>
        <li>Numero da Carterinha: {patients.unimedCard}</li>
        <li>Endereço: {patients.address}</li>
        <li>Telefone: {patients.phone}</li>
        <li>Cidade: {patients.city}</li>
        <li>Estado: {patients.state}</li>
      </ul>
    </div>
  );
}
