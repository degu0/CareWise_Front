import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Mensagem {
  texto: string;
  deUsuario: boolean;
}

interface MaquinaDeEscreverProps {
  text: string;
}

function MaquinaDeEscrever({ text }: MaquinaDeEscreverProps) {
  const [displayText, setDisplayText] = useState("");

  const calcularVelocidade = (texto: string) => {
    const tamanho = texto.length;
    if (tamanho <= 20) return 100;
    if (tamanho <= 50) return 70;
    if (tamanho <= 100) return 50;
    if (tamanho <= 200) return 30;
    return 20;
  };

  const escreverNaTela = (text: string, i = 0) => {
    if (i < text.length) {
      setDisplayText(text.slice(0, i + 1));
      const velocidade = calcularVelocidade(text);
      setTimeout(() => escreverNaTela(text, i + 1), velocidade);
    }
  };

  useEffect(() => {
    escreverNaTela(text);
  }, [text]);

  return <p>{displayText}</p>;
}

export default function Chat() {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient") || "{}");
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { texto: `${patient.name} qual é o diagnotico delx?`, deUsuario: true },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  async function enviarMensagem() {
    if (!input.trim()) return;

    setMensagens((prev) => [...prev, { texto: input, deUsuario: true }]);
    const mensagemUsuario = input;
    setInput("");

    try {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) throw new Error("Paciente não definido");

      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          message: mensagemUsuario,
        }),
      });

      if (!response.ok) throw new Error("Erro na API de chat");

      const data = await response.json();

      setMensagens((prev) => [
        ...prev,
        { texto: data.response, deUsuario: false },
      ]);
    } catch (error) {
      console.error("Erro:", error);
      setMensagens((prev) => [
        ...prev,
        { texto: "Erro ao obter resposta do assistente.", deUsuario: false },
      ]);
    }
  }

  const abrirProntuario = () => {
    if (patient.id) {
      navigate(`/prontuario/${patient.id}`);
    } else {
      alert("Paciente não encontrado.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex flex-col gap-2 w-full max-w-2xl h-[70%] overflow-y-auto p-4 rounded-2xl">
        {mensagens.map((m, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-xl text-sm max-w-[70%] break-words ${
              m.deUsuario
                ? "bg-blue-500 text-white self-end rounded-tr-sm"
                : "bg-gray-200 text-gray-800 self-start rounded-tl-sm"
            }`}
          >
            {m.deUsuario ? (
              <p>{m.texto}</p>
            ) : (
              <MaquinaDeEscrever text={m.texto} />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 w-full max-w-2xl mt-4">
        <button
          onClick={abrirProntuario}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Ver Prontuário
        </button>

        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={enviarMensagem}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
