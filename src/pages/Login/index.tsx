import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext, UserRole } from "../../context/AuthContextProvider";

type UserType = {
  id: string;
  email: string;
  role: UserRole;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/users?email=" +
          encodeURIComponent(formData.email)
      );

      if (!response.ok) throw new Error("Erro ao buscar usuário");

      const users: UserType[] = await response.json();
      const user = users[0];

      if (!user || user.password !== formData.password) {
        throw new Error("Email ou senha incorretos");
      }

      login({
        id: user.id,  
        email: user.email,
        role: user.role as UserRole,
      });
      const userLocal = { id: "1", role: "doctor", email: "doctor@example.com" };
      localStorage.setItem("user", JSON.stringify(userLocal));

      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
      } else {
        switch (user.role) {
          case UserRole.DOCTOR:
            navigate("/medico", { replace: true });
            break;
          case UserRole.NURSE:
            navigate("/enfermeira", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error instanceof Error ? error.message : "Erro durante o login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Faça login para acessar o painel de pacientes
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-full text-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Ainda não possui conta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
