import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, type PatientFormData } from "../../hooks/schemas";
import { Input } from "../../components/Input";

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const formatCpf = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

const formatUnimedCard = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 1) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)}`;
  if (numbers.length <= 15) return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 15)}`;
  return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(4, 16)} ${numbers.slice(16, 17)}`;
};

export default function PatientRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao registrar paciente");

      const result = await response.json();
      console.log("Sucesso:", result);
      reset();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Cadastrar Paciente</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Input
            label="Nome Completo"
            name="name"
            register={register}
            error={errors.name}
            required
          />

          <div className="flex justify-between gap-5">
            <Input
              label="Ano de Nascimento"
              name="yearOfBirth"
              type="date"
              register={register}
              error={errors.yearOfBirth}
              required
            />

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="gender" className="font-medium">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                {...register("gender")}
                className={`w-full p-2 border rounded-md ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm">
                  {errors.gender.message}
                </span>
              )}
            </div>
          </div>

          {/* UNIMED CARD */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="unimedCard" className="font-medium">
              Numero da carterinha <span className="text-red-500">*</span>
            </label>
            <input
              id="unimedCard"
              type="text"
              {...register("unimedCard")}
              onChange={(e) => setValue("unimedCard", formatUnimedCard(e.target.value))}
              placeholder="9 999 999999999999 9"
              className={`w-full p-2 border rounded-md ${
                errors.unimedCard ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.unimedCard && (
              <span className="text-red-500 text-sm">
                {errors.unimedCard.message}
              </span>
            )}
          </div>

          <div className="flex justify-between gap-5">
            {/* CPF */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="cpf" className="font-medium">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                id="cpf"
                type="text"
                {...register("cpf")}
                onChange={(e) => setValue("cpf", formatCpf(e.target.value))}
                placeholder="999.999.999-99"
                className={`w-full p-2 border rounded-md ${
                  errors.cpf ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cpf && (
                <span className="text-red-500 text-sm">{errors.cpf.message}</span>
              )}
            </div>

            {/* PHONE */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="phone" className="font-medium">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                {...register("phone")}
                onChange={(e) => setValue("phone", formatPhone(e.target.value))}
                placeholder="(99) 99999-9999"
                className={`w-full p-2 border rounded-md ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone.message}</span>
              )}
            </div>
          </div>

          <Input
            label="Endereço"
            name="address"
            register={register}
            error={errors.address}
            required
          />

          <div className="flex justify-between gap-5">
            <Input
              label="Cidade"
              name="city"
              register={register}
              error={errors.city}
              required
            />
            <Input
              label="Estado"
              name="state"
              register={register}
              error={errors.state}
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-50 bg-blue-950 py-3 text-white border-none rounded-sm cursor-pointer"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
