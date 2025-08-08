import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  yearOfBirth: z.string().min(1, "Ano de nascimento é obrigatório"),
  gender: z.string().min(1, "Selecione um sexo"),
  cpf: z.string()
    .min(10, "CPF deve ter 10 dígitos"),
  unimedCard: z.string().min(1, "Número do cartão é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phone: z.string().min(11, "Telefone inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

export type PatientFormData = z.infer<typeof patientSchema>;