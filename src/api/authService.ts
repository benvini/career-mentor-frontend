import {
  api,
  type LoginCredentials,
  type RegisterCredentials,
  handleApiError,
} from "./api";
import { authStorage, type AuthData } from "./authStorage";

/**
 * Authentication service - Business logic layer
 * Combines API calls with storage management
 */
export class AuthService {
  /**
   * Login user and store auth data
   */
  static async login(
    credentials: LoginCredentials,
    rememberMe: boolean = false
  ): Promise<{
    success: boolean;
    error?: string;
    user?: { email: string; token: string };
  }> {
    try {
      const response = await api.auth.login(credentials);
      const { token } = response.data;

      // Store auth data
      authStorage.setAuthData({
        token,
        email: credentials.email,
        rememberMe,
      });

      return {
        success: true,
        user: { email: credentials.email, token },
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Register new user
   */
  static async register(credentials: RegisterCredentials): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await api.auth.register(credentials);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Logout user and clear all auth data
   */
  static logout(): void {
    authStorage.clearAuthData();
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return authStorage.isAuthenticated();
  }

  /**
   * Get current user data
   */
  static getCurrentUser(): AuthData | null {
    return authStorage.getAuthData();
  }

  /**
   * Get current user email
   */
  static getCurrentUserEmail(): string | null {
    return authStorage.getUserEmail();
  }

  /**
   * Get user display name
   */
  static getUserDisplayName(): string {
    return authStorage.getUserDisplayName();
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await api.auth.refreshToken();
      const { token } = response.data;

      // Update stored token
      authStorage.setToken(token);

      return { success: true };
    } catch (error: unknown) {
      // If refresh fails, clear auth data
      authStorage.clearAuthData();
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Forgot password request
   */
  static async forgotPassword(email: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await api.auth.forgotPassword(email);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await api.auth.resetPassword(token, password);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }> {
    try {
      const response = await api.auth.verifyEmail(token);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleApiError(error as import("axios").AxiosError),
      };
    }
  }

  /**
   * Handle authentication errors (e.g., token expiry)
   * Returns true if the error was handled and user should be redirected
   */
  static handleAuthError(error: unknown): boolean {
    const axiosError = error as import("axios").AxiosError;
    if (axiosError.response?.status === 401) {
      this.logout();
      return true; // Signal that redirect is needed
    }
    return false;
  }

  /**
   * Initialize auth on app startup
   * Checks if user has valid stored session
   */
  static initializeAuth(): {
    isAuthenticated: boolean;
    user?: AuthData;
  } {
    const isAuth = this.isAuthenticated();
    const user = isAuth ? this.getCurrentUser() : undefined;

    return {
      isAuthenticated: isAuth,
      user: user || undefined,
    };
  }

  /**
   * Auto-logout after inactivity (optional feature)
   */
  static setupAutoLogout(timeoutMinutes: number = 30): void {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.logout();
        window.location.href = "/login?reason=timeout";
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset timeout on user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout, true);
    });

    // Initial timeout
    resetTimeout();
  }
}

/**
 * React hook for authentication
 */
export const useAuth = () => {
  const login = async (credentials: LoginCredentials, rememberMe?: boolean) => {
    return AuthService.login(credentials, rememberMe);
  };

  const register = async (credentials: RegisterCredentials) => {
    return AuthService.register(credentials);
  };

  const logout = () => {
    AuthService.logout();
  };

  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  const getCurrentUser = () => {
    return AuthService.getCurrentUser();
  };

  const refreshToken = async () => {
    return AuthService.refreshToken();
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    refreshToken,
    getUserDisplayName: AuthService.getUserDisplayName,
    handleAuthError: AuthService.handleAuthError,
  };
};
