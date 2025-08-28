import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export enum UserRole {
  DOCTOR = "doctor",
  NURSE = "nurse",
}

type UserType = {
  id: string;       // ✅ agora incluído
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);

  const isAuthenticated = !!user;

  const login = useCallback((userData: UserType) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored) as UserType;
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
