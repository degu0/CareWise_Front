import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/Input";

// Schema Zod atualizado para todos os campos
// eslint-disable-next-line react-refresh/only-export-components
export const patientSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  unimed_card: z.string().min(5, "Cartão Unimed obrigatório"),
  address: z.string().min(5, "Endereço obrigatório"),
  phone: z.string().min(10, "Telefone obrigatório"),
  nationality: z.string().min(2, "Nacionalidade obrigatória"),
  city: z.string().min(2, "Cidade obrigatória"),
  cpf: z.string().min(11, "CPF obrigatório"),
  yearOfBirth: z.string().min(4, "Ano de nascimento obrigatório"),
});

export type PatientFormData = z.infer<typeof patientSchema>;

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

const formatCpf = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9
  )}-${numbers.slice(9, 11)}`;
};

const formatUnimedCard = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 1) return numbers;
  if (numbers.length <= 4)
    return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)}`;
  if (numbers.length <= 15)
    return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(
      4,
      15
    )}`;
  return `${numbers.slice(0, 1)} ${numbers.slice(1, 4)} ${numbers.slice(
    4,
    16
  )} ${numbers.slice(16, 17)}`;
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
      // Converte yearOfBirth em idade
      const birthDate = new Date(data.yearOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      const payload = {
        name: data.name,
        email: data.email,
        unimed_card: data.unimed_card,
        address: data.address,
        phone: data.phone.replace(/\D/g, ""),
        nationality: data.nationality,
        city: data.city,
        cpf: data.cpf.replace(/\D/g, ""),
        age,
      };

      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Cadastrar Paciente
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6"
      >
        <Input
          label="Nome Completo"
          name="name"
          register={register}
          error={errors.name}
          required
        />

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="cpf" className="font-medium text-gray-700">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              {...register("cpf")}
              onChange={(e) => setValue("cpf", formatCpf(e.target.value))}
              placeholder="999.999.999-99"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 ${
                errors.cpf ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cpf && (
              <span className="text-red-500 text-sm">{errors.cpf.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="phone" className="font-medium text-gray-700">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              onChange={(e) => setValue("phone", formatPhone(e.target.value))}
              placeholder="(99) 99999-9999"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
        />
        <Input
          label="Cartão Unimed"
          name="unimed_card"
          register={register}
          error={errors.unimed_card}
          required
          onChange={(e) =>
            setValue("unimed_card", formatUnimedCard(e.target.value))
          }
        />

        <div className="flex flex-col md:flex-row gap-5">
          <Input
            label="Ano de Nascimento"
            name="yearOfBirth"
            type="date"
            register={register}
            error={errors.yearOfBirth}
            required
            className="flex-1"
          />
        </div>

        <Input
          label="Endereço"
          name="address"
          register={register}
          error={errors.address}
          required
        />

        <div className="flex gap-5">
          <Input
            label="Nacionalidade"
            name="nationality"
            register={register}
            error={errors.nationality}
            required
          />
          <Input
            label="Cidade"
            name="city"
            register={register}
            error={errors.city}
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md transition-colors shadow-md"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
