import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormPatient() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const {id} = useParams()
  const [complaint, setComplaint] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        patientId: id,
        complaint,
      };

      const response = await fetch(`${API_URL}/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao registrar paciente");

      navigate("/paciente/lista");
    } catch (error) {
      console.error("Erro ao registrar paciente:", error);
    }
  };

  return (
    <main className="h-screen w-full flex items-center justify-center">
      {" "}
      <form
        onSubmit={onSubmit}
        className="w-3xl flex flex-col mx-auto gap-2 p-4"
      >
        <label htmlFor="complaint" className="font-medium">
          Descreva os sintomas do paciente
        </label>
        <textarea
          id="complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          rows={5}
          className="px-4 py-2 border border-zinc-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
          placeholder="Digite os sintomas aqui..."
        ></textarea>
        <button
          type="submit"
          className="mt-2 p-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
