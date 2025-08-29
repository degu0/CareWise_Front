import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../../components/Input";
import { useNavigate } from "react-router-dom";

// Schema Zod atualizado para todos os campos
export const patientSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço obrigatório"),
  phone: z.string().min(10, "Telefone obrigatório"),
  nationality: z.string().min(2, "Nacionalidade obrigatória"),
  city: z.string().min(2, "Cidade obrigatória"),
  cpf: z.string().min(11, "CPF obrigatório"),
  yearOfBirth: z.string().min(4, "Ano de nascimento obrigatório"),
  gender: z.enum(["Masculino", "Feminino", "Outro"], "Selecione o sexo"),
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

export default function PatientRegister() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
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
      const birthYear = new Date(data.yearOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      const payload = {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
        cpf: data.cpf.replace(/\D/g, ""),
        age,
      };

      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao registrar paciente");

      const result = await response.json();
      localStorage.setItem("patientRegister", JSON.stringify(result))
      reset();
      navigate("/formulario");
    } catch (error) {
      console.error("Erro ao registrar paciente:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-zinc-100 min-h-screen">
      <h2 className="text-3xl font-bold text-zinc-800 mb-6">
        Cadastrar Paciente
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-full flex flex-col gap-6"
      >
        <Input
          label="Nome Completo"
          name="name"
          register={register}
          error={errors.name}
          required
        />

        <div className="flex flex-col gap-7">
          <span className="font-medium text-zinc-700">
            Sexo <span className="text-red-500">*</span>
          </span>
          <div className="flex justify-between items-center w-[90%]">
            {["Masculino", "Feminino", "Outro"].map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="radio"
                  value={gender}
                  {...register("gender")}
                  className="accent-teal-600"
                />
                {gender}
              </label>
            ))}
          </div>
          {errors.gender && (
            <span className="text-red-500 text-sm">
              {errors.gender.message}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="cpf" className="font-medium text-zinc-700">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              {...register("cpf")}
              onChange={(e) => setValue("cpf", formatCpf(e.target.value))}
              placeholder="999.999.999-99"
              className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-teal-400 ${
                errors.cpf ? "border-red-500" : "border-zinc-300"
              }`}
            />
            {errors.cpf && (
              <span className="text-red-500 text-sm">{errors.cpf.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="phone" className="font-medium text-zinc-700">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              onChange={(e) => setValue("phone", formatPhone(e.target.value))}
              placeholder="(99) 99999-9999"
              className={`w-full p-3 border rounded-md bg-white focus:ring-2 focus:ring-teal-400 ${
                errors.phone ? "border-red-500" : "border-zinc-300"
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
          label="Ano de Nascimento"
          name="yearOfBirth"
          type="date"
          register={register}
          error={errors.yearOfBirth}
          required
        />

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
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-10 rounded-md transition-colors shadow-md cursor-pointer"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
