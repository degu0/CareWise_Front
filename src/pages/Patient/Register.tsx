import { useState } from "react";

export default function PatientRegister() {
  const [formData, setFormData] = useState({
    name: "",
    yearOfBirth: "",
    gender: "",
    cpf: "",
    unimedCard: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    nationality: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Erro ao registrar paciente");
        return;
      }

      const data = await response.json();
      console.log("Paciente registrado com sucesso:", data);

      setFormData({
        name: "",
        yearOfBirth: "",
        gender: "",
        cpf: "",
        unimedCard: "",
        address: "",
        phone: "",
        email: "",
        city: "",
        nationality: "",
      });
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Cadastrar Paciente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="yearOfBirth">Ano de Nascimento</label>
          <input
            type="date"
            id="yearOfBirth"
            name="yearOfBirth"
            value={formData.yearOfBirth}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="gender">Sexo</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        <div>
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="unimedCard">Carteirinha da Unimed</label>
          <input
            type="text"
            id="unimedCard"
            name="unimedCard"
            value={formData.unimedCard}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Endereço Residencial</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone">Telefone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="city">Cidade</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="nationality">Nacionalidade</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
