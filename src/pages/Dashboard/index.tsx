import { useState } from "react";
import { DropdownSelect } from "../../components/Dropdown";
import { VisitorsLineChart } from "../../components/Chart";

export default function Dashboard() {
  const [selectedGender, setSelectedGender] = useState("Masculino");

  const data = {
    Masculino: [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 40 },
      { month: "Mar", value: 35 },
    ],
    Feminino: [
      { month: "Jan", value: 25 },
      { month: "Feb", value: 30 },
      { month: "Mar", value: 45 },
    ],
  };

  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">📊 Dashboard de Pacientes</h2>
        <p className="text-gray-600 mt-1">
          Visualize dados relacionados aos pacientes em diferentes gráficos.
        </p>
      </header>

      <div className="max-w-6xl m-auto flex flex-col gap-6">
        <div className="flex justify-end">
          <DropdownSelect
            data={["Masculino", "Feminino"]}
            placeholder="Selecione o gênero"
            onSelect={setSelectedGender}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Evolução de Pacientes Atendidos
            </h3>
            <VisitorsLineChart chartData={data[selectedGender]} />
          </div>

          <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-center text-gray-400">
            <span>📈 Outro gráfico em breve...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
