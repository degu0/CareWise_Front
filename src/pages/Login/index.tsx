import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext, UserRole } from "../../context/AuthContextProvider";
import logo from "../../assets/logo.png"

type UserType = {
  id: string;
  email: string;
  role: UserRole;
  password: string;
};

const mockUsers: UserType[] = [
  {
    id: "1",
    email: "doctor@example.com",
    password: "123456",
    role: UserRole.DOCTOR,
  },
  {
    id: "2",
    email: "nurse@example.com",
    password: "123456",
    role: UserRole.NURSE,
  },
];

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === formData.email);

      if (!user || user.password !== formData.password) {
        setError("Email ou senha incorretos");
        setIsLoading(false);
        return;
      }

      login({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ id: user.id, email: user.email, role: user.role })
      );

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

      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md p-8 md:p-10">
        <img src={logo} alt="logo da CareWise" className="m-auto w-40" />
        <h1 className="text-3xl font-extrabold text-center text-zinc-800 mb-6">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-zinc-500 mb-8">
          Faça login para acessar 
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-zinc-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-zinc-700 font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-5 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
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
            className="w-full py-3 mt-2 bg-teal-700 text-white font-semibold rounded-full text-lg hover:bg-teal-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6">
          Ainda não possui conta?{" "}
          <Link
            to="/register"
            className="text-teal-600 font-semibold hover:text-teal-700 transition"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
