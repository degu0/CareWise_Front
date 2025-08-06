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

      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error instanceof Error ? error.message : "Erro durante o login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white text-lg">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md my-30 flex flex-col gap-3"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {error && (
          <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2 hover:bg-amber-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Carregando..." : "Login"}
        </button>

        <p className="text-center text-base">
          Ainda não possui uma conta?{" "}
          <Link
            to="/register"
            className="font-bold text-amber-600 hover:text-amber-700"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
