import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-120">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtrar Pesquisa</h2>
          <button
            onClick={close}
            className="text-zinc-500 hover:text-zinc-800 font-bold cursor-pointer"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Gênero:</p>
          <div className="flex justify-around gap-4">
            <div className="flex items-center">
              <input type="radio" name="gender" id="male" className="mr-2" onChange={() => setGender('masculino')} />
              <label htmlFor="male">Masculino</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="gender" id="female" className="mr-2" onChange={() => setGender('feminino')} />
              <label htmlFor="female">Feminino</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="gender" id="other" className="mr-2" onChange={() => setGender('outro')} />
              <label htmlFor="other">Outro</label>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-medium mb-2">Idade:</p>
          <div className="flex gap-4 flex-wrap justify-around">
            <div className="flex items-center">
              <input type="radio" name="age" id="under18" className="mr-2" onChange={() => setAge('<18')} />
              <label htmlFor="under18">-18</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="age" id="18to25" className="mr-2" onChange={() => setAge('18-25')} />
              <label htmlFor="18to25">18-25</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="age" id="26to40" className="mr-2" onChange={() => setAge('26-40')} />
              <label htmlFor="26to40">26-40</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="age" id="41to69" className="mr-2" onChange={() => setAge('41-69')} />
              <label htmlFor="41to69">41-69</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="age" id="70plus" className="mr-2" onChange={() => setAge('70+')} />
              <label htmlFor="70plus">70+</label>
            </div>
          </div>
        </div>
        <button
          onClick={handleApply}
          className="bg-teal-500 text-white w-full py-2 rounded hover:bg-teal-600"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};
