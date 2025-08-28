import { useState } from "react";
import { DropdownSelect } from "../../components/Dropdown";
import { VisitorsLineChart } from "../../components/Chart/Line";
import { CustomPieChart } from "../../components/Chart/Pie";

type DiseaseData = {
  disease: string;
  confirmedCases: number;
};

type LineData = {
  month: string;
  value: number;
};

const lineDataByDisease: Record<string, LineData[]> = {
  Gripe: [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 40 },
  ],
  Diabetes: [
    { month: "Jan", value: 15 },
    { month: "Feb", value: 25 },
    { month: "Mar", value: 45 },
  ],
  Hipertensão: [
    { month: "Jan", value: 30 },
    { month: "Feb", value: 50 },
    { month: "Mar", value: 70 },
  ],
  Asma: [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 15 },
    { month: "Mar", value: 20 },
  ],
  "Covid-19": [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 80 },
  ],
};


const pieData: DiseaseData[] = [
  { disease: "Gripe", confirmedCases: 120 },
  { disease: "Diabetes", confirmedCases: 85 },
  { disease: "Hipertensão", confirmedCases: 150 },
  { disease: "Asma", confirmedCases: 60 },
  { disease: "Covid-19", confirmedCases: 200 },
];

export default function Dashboard() {
  const [selectedDisease, setSelectedDisease] = useState("Gripe");

  const diseaseOptions = pieData.map(d => d.disease);

  return (
    <div className="h-full w-full p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-zinc-800">
          Dashboard
        </h2>
        <p className="text-zinc-600 mt-1">
          Visualize dados relacionados aos pacientes em diferentes gráficos.
        </p>
      </header>

      <div className="max-w-6xl m-auto flex flex-col gap-6">
        <div className="flex justify-end">
          <DropdownSelect
            data={diseaseOptions}
            placeholder="Selecione a doença"
            onSelect={setSelectedDisease}
          />
        </div>

        <div className="flex flex-col gap-10">
          <div className="p-4">
            <h3 className="text-lg font-medium text-zinc-700 mb-3">
              Evolução de {selectedDisease}
            </h3>
            <VisitorsLineChart chartData={lineDataByDisease[selectedDisease]} />
          </div>

          <div className="p-4">
            <h2 className="text-lg font-medium text-zinc-700 mb-3">
              Distribuição de Doenças
            </h2>
            <CustomPieChart
              data={pieData.map(d => ({
                name: d.disease,
                value: d.confirmedCases,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
