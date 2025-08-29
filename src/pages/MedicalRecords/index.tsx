import { useEffect, useState } from "react";
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
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [patient, setPatient] = useState<Paciente | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${API_URL}/patients?id=${id}`);
        const data: Paciente[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setPatient(data[0]);
        }
      } catch (error) {
        console.error("Erro na busca de dados:", error);
      }
    }
    fetchPatients();
  }, [API_URL, id]);

  const [mostrarSintomas, setMostrarSintomas] = useState(false);
  const [mostrarExames, setMostrarExames] = useState(false);

  const [novoSintoma, setNovoSintoma] = useState("");
  const [sintomas, setSintomas] = useState<SintomaItem[]>([]);

  const [nomeExame, setNomeExame] = useState("");
  const [resultadoExame, setResultadoExame] = useState("");
  const [exames, setExames] = useState<ExameItem[]>([]);

  // Campos para prontuário
  const [initialComplaint, setInitialComplaint] = useState("");
  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  // Salvar sintomas
  function salvarSintoma() {
    if (!novoSintoma.trim()) return;
    setSintomas((prev) => [
      { descricao: novoSintoma.trim(), id: crypto.randomUUID() },
      ...prev,
    ]);
    setNovoSintoma("");
    setMostrarSintomas(false);
  }

  // Salvar exames
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

  // POST prontuário
  async function salvarProntuario() {
    if (!patient) return;

    try {
      const response = await fetch(`${API_URL}/prontuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          initialComplaint,
          finalDiagnosis,
          notes,
          sintomas: sintomas.map((s) => ({ descricao: s.descricao })),
          exames: exames.map((e) => ({ nome: e.nome, resultado: e.resultado })),
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar prontuário");

      const data = await response.json();
      console.log("Prontuário salvo:", data);
      alert("Prontuário salvo com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar prontuário");
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 min-h-screen">
      {patient ? (
        <section className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-4">
            {patient.name}
          </h1>
          <div className="grid grid-cols-2 gap-4 text-zinc-600 text-sm">
            <p><span className="font-medium">Idade:</span> {patient.yearOfBirth}</p>
            <p><span className="font-medium">Sexo:</span> {patient.gender}</p>
            <p><span className="font-medium">CPF:</span> {patient.cpf}</p>
          </div>
        </section>
      ) : (
        <p className="text-center text-zinc-500">Carregando paciente...</p>
      )}

      {/* Campos principais do prontuário */}
      <section className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 space-y-4">
        <textarea
          placeholder="Queixa inicial..."
          value={initialComplaint}
          onChange={(e) => setInitialComplaint(e.target.value)}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Diagnóstico final..."
          value={finalDiagnosis}
          onChange={(e) => setFinalDiagnosis(e.target.value)}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Observações..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2"
        />
      </section>

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

      {/* EXAMES */}
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

      {/* Botão final de salvar prontuário */}
      <section className="flex justify-end">
        <button
          type="button"
          onClick={salvarProntuario}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition cursor-pointer"
        >
          Salvar Prontuário
        </button>
      </section>
    </main>
  );
}