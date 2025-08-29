import { useState } from "react";

type ModalFilterProps = {
  close: () => void;
  onApply: (filters: {
    gender?: string;
    age?: string;
  }) => void;
};

export function ModalFilter({ close, onApply }: ModalFilterProps) {
  const [gender, setGender] = useState<string>();
  const [age, setAge] = useState<string>();

  const handleApply = () => {
    onApply({ gender, age });
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Filtrar pacientes</h2>

        <label className="block mb-2">
          Gênero:
          <select
            className="border w-full p-2 rounded mt-1"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="block mb-2">
          Idade:
          <select
            className="border w-full p-2 rounded mt-1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="<18">Menor de 18</option>
            <option value="18-25">18 a 25</option>
            <option value="26-40">26 a 40</option>
            <option value="41-69">41 a 69</option>
            <option value="70+">70+</option>
          </select>
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={close}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded"
            onClick={handleApply}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
