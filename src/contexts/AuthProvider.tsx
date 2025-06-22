import { useState, useEffect, type ReactNode } from "react";
import { AuthService } from "../api/authService";
import { AuthContext, type AuthContextType } from "./auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      const userData = AuthService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(userData);
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      const authenticated = AuthService.isAuthenticated();
      const userData = AuthService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(userData);
    };

    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    const result = await AuthService.login({ email, password }, rememberMe);

    if (result.success) {
      setIsAuthenticated(true);
      setUser(AuthService.getCurrentUser());
      return true;
    }

    return false;
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          color: "#667eea",
        }}
      >
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
