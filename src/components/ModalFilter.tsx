import { useState } from "react";

interface ModalProps {
  close: () => void;
  onApply: (filters: {
    gender?: string;
    age?: string;
    disease?: string;
  }) => void;
}

export const ModalFilter = ({ close, onApply }: ModalProps) => {
  const doencas = ["Gripe", "Covid-19"];

  const [gender, setGender] = useState<string>();
  const [age, setAge] = useState<string>();
  const [disease, setDisease] = useState<string>(doencas[0]);

  const handleApply = () => {
    onApply({ gender, age, disease });
    close(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtrar Pesquisa</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            X
          </button>
        </div>
        <div className="mb-4">
          <p className="font-medium mb-2">Gênero:</p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input type="radio" name="gender" id="male" className="mr-2" onChange={() => setGender('male')} />
              <label htmlFor="male">Masculino</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="gender" id="female" className="mr-2" onChange={() => setGender('female')} />
              <label htmlFor="female">Feminino</label>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-medium mb-2">Idade:</p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input type="radio" name="age" id="under18" className="mr-2" onChange={() => setAge('-18')} />
              <label htmlFor="under18">-18</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="age" id="18plus" className="mr-2" onChange={() => setAge('18+')} />
              <label htmlFor="18plus">18+</label>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-medium mb-2">Doenças:</p>
          <select className="w-full border border-gray-300 rounded p-2" onChange={(e) => setDisease(e.target.value)} value={disease}>
            {doencas.map((doenca) => (
              <option key={doenca} value={doenca}>
                {doenca}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleApply} className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};
