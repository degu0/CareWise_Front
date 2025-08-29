import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MarkdownText from "../../components/MarkdownText";

interface Mensagem {
  texto: string;
  deUsuario: boolean;
  carregando?: boolean;
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
    return 10;
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

  return <MarkdownText>{displayText}</MarkdownText>;
}

export default function Chat() {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient") || "{}");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState(
    `Paciente: ${patient.name}. Por favor, analise os sintomas e histórico e forneça um diagnóstico detalhado.`
  );
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const ajustarAltura = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    scrollToBottom();
    ajustarAltura();
  }, [mensagens, input]);

  async function enviarMensagem() {
    if (!input.trim()) return;

    setMensagens((prev) => [...prev, { texto: input, deUsuario: true }]);
    const mensagemUsuario = input;
    setInput("");

    setMensagens((prev) => [
      ...prev,
      { texto: "", deUsuario: false, carregando: true },
    ]);

    try {
      const patientId = patient.id;
      if (!patientId) throw new Error("Paciente não definido");

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          message: mensagemUsuario,
        }),
      });

      if (!response.ok) throw new Error("Erro na API de chat");
      const data = await response.json();

      // Substitui a mensagem carregando pela resposta da API
      setMensagens((prev) =>
        prev.map((m) =>
          m.carregando ? { texto: data.response, deUsuario: false } : m
        )
      );
    } catch (error) {
      console.error("Erro:", error);
      setMensagens((prev) =>
        prev.map((m) =>
          m.carregando
            ? { texto: "Erro ao obter resposta do assistente.", deUsuario: false }
            : m
        )
      );
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
    <div className="flex flex-col h-screen">
      <div className="flex flex-col gap-2 w-full max-w-6xl h-full overflow-y-auto p-4 pr-8 rounded-2xl mx-auto">
        {mensagens.map((m, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-xl text-sm max-w-[70%] break-words ${
              m.deUsuario
                ? "bg-teal-500 text-white self-end rounded-tr-sm"
                : "bg-zinc-200 text-zinc-800 self-start rounded-tl-sm"
            }`}
          >
            {m.deUsuario ? (
              <p>{m.texto}</p>
            ) : m.carregando ? (
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce animation-delay-200"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce animation-delay-400"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce animation-delay-600"></span>
              </div>
            ) : (
              <MaquinaDeEscrever text={m.texto} />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 w-full max-w-2xl mx-auto p-4">
        <button
          onClick={abrirProntuario}
          className="p-2 text-teal-500 rounded-lg font-medium hover:bg-teal-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <FaPlus size={20} />
        </button>

        <textarea
          ref={inputRef}
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviarMensagem();
            }
          }}
          rows={1}
          className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 overflow-hidden"
        />

        <button
          onClick={enviarMensagem}
          className="p-2 text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
