import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useParams } from "react-router-dom";

interface Paciente {
  id: string;
  name: string;
  yearOfBirth: number;
  gender: "Masculino" | "Feminino" | "Outro";
  cpf: string;
}

interface SintomaItem {
  descricao: string;
  id: string;
}

interface ExameItem {
  nome: string;
  resultado: string;
  id: string;
}

export default function MedicalRecords() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Paciente | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`http://localhost:3000/patients?id=${id}`);
        const data: Paciente[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setPatient(data[0]);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }
    fetchPatients();
  }, [id]);

  const [mostrarSintomas, setMostrarSintomas] = useState(false);
  const [mostrarExames, setMostrarExames] = useState(false);

  const [novoSintoma, setNovoSintoma] = useState("");
  const [sintomas, setSintomas] = useState<SintomaItem[]>([]);

  const [nomeExame, setNomeExame] = useState("");
  const [resultadoExame, setResultadoExame] = useState("");
  const [exames, setExames] = useState<ExameItem[]>([]);

  // Salvar
  function salvarSintoma() {
    if (!novoSintoma.trim()) return;
    setSintomas((prev) => [
      { descricao: novoSintoma.trim(), id: crypto.randomUUID() },
      ...prev,
    ]);
    setNovoSintoma("");
    setMostrarSintomas(false);
  }

  function salvarExame() {
    if (!nomeExame.trim() && !resultadoExame.trim()) return;
    setExames((prev) => [
      {
        nome: nomeExame.trim(),
        resultado: resultadoExame.trim(),
        id: crypto.randomUUID(),
      },
      ...prev,
    ]);
    setNomeExame("");
    setResultadoExame("");
    setMostrarExames(false);
  }

  // Remover
  function removerSintoma(id: string) {
    setSintomas((prev) => prev.filter((s) => s.id !== id));
  }

  function removerExame(id: string) {
    setExames((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 h-screen">
      {patient ? (
        <section className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-4">
            {patient.name}
          </h1>
          <div className="grid grid-cols-2 gap-4 text-zinc-600 text-sm">
            <p>
              <span className="font-medium">Idade:</span> {patient.yearOfBirth}
            </p>
            <p>
              <span className="font-medium">Sexo:</span> {patient.gender}
            </p>
            <p>
              <span className="font-medium">CPF:</span> {patient.cpf}
            </p>
          </div>
        </section>
      ) : (
        <p className="text-center text-zinc-500">Carregando paciente...</p>
      )}

      {/* SINTOMAS */}
      <section className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-900">Sintomas</h3>
          <button
            type="button"
            onClick={() => setMostrarSintomas((v) => !v)}
            className="w-9 h-9 border border-zinc-300 rounded-full text-xl flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
          >
            <FaPlus size={12} />
          </button>
        </div>

        {mostrarSintomas && (
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={novoSintoma}
              onChange={(e) => setNovoSintoma(e.target.value)}
              placeholder="Descreva o sintoma..."
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={salvarSintoma}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              Salvar
            </button>
          </div>
        )}

        {sintomas.length > 0 && (
          <ul className="flex flex-col gap-2">
            {sintomas.map((s) => (
              <li
                key={s.id}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-zinc-800 text-sm flex items-center justify-between"
              >
                <span>{s.descricao}</span>
                <IoClose
                  className="text-red-500 cursor-pointer"
                  onClick={() => removerSintoma(s.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-900">Exames</h3>
          <button
            type="button"
            onClick={() => setMostrarExames((v) => !v)}
            className="w-9 h-9 border border-zinc-300 rounded-full text-xl flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
          >
            <FaPlus size={12} />
          </button>
        </div>

        {mostrarExames && (
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={nomeExame}
              onChange={(e) => setNomeExame(e.target.value)}
              placeholder="Nome do exame..."
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              value={resultadoExame}
              onChange={(e) => setResultadoExame(e.target.value)}
              placeholder="Resultado do exame..."
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px]"
            />
            <button
              type="button"
              onClick={salvarExame}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              Salvar
            </button>
          </div>
        )}

        {exames.length > 0 && (
          <ul className="flex flex-col gap-2">
            {exames.map((e) => (
              <li
                key={e.id}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-zinc-800 text-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    {e.nome || "Exame"}
                  </p>
                  {e.resultado && <p>{e.resultado}</p>}
                </div>
                <IoClose
                  className="text-red-500 cursor-pointer"
                  onClick={() => removerExame(e.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
