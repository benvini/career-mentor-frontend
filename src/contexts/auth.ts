import { createContext } from "react";
import type { AuthData } from "../api/authStorage";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthData | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
