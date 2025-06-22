export interface AuthData {
  token: string;
  email: string;
  rememberMe?: boolean;
}

export interface UserPreferences {
  language: string;
  theme?: "light" | "dark";
}

/**
 * Authentication storage utilities
 * Handles all localStorage operations for auth data
 */
export const authStorage = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  removeToken(): void {
    localStorage.removeItem("token");
  },

  // User email management
  getUserEmail(): string | null {
    return localStorage.getItem("userEmail");
  },

  setUserEmail(email: string): void {
    localStorage.setItem("userEmail", email);
  },

  removeUserEmail(): void {
    localStorage.removeItem("userEmail");
  },

  // Remember me functionality
  getRememberMe(): boolean {
    return localStorage.getItem("rememberMe") === "true";
  },

  setRememberMe(remember: boolean): void {
    if (remember) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  },

  removeRememberMe(): void {
    localStorage.removeItem("rememberMe");
  },

  // Combined auth data operations
  setAuthData(data: AuthData): void {
    this.setToken(data.token);
    this.setUserEmail(data.email);
    if (data.rememberMe !== undefined) {
      this.setRememberMe(data.rememberMe);
    }
  },

  getAuthData(): AuthData | null {
    const token = this.getToken();
    const email = this.getUserEmail();

    if (!token || !email) {
      return null;
    }

    return {
      token,
      email,
      rememberMe: this.getRememberMe(),
    };
  },

  clearAuthData(): void {
    this.removeToken();
    this.removeUserEmail();
    this.removeRememberMe();
  },

  // Authentication status
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token.length > 0;
  },

  // User preferences
  getPreferredLanguage(): string {
    return localStorage.getItem("preferredLanguage") || "en";
  },

  setPreferredLanguage(language: string): void {
    localStorage.setItem("preferredLanguage", language);
  },

  getUserPreferences(): UserPreferences {
    return {
      language: this.getPreferredLanguage(),
      theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
    };
  },

  setUserPreferences(preferences: Partial<UserPreferences>): void {
    if (preferences.language) {
      this.setPreferredLanguage(preferences.language);
    }
    if (preferences.theme) {
      localStorage.setItem("theme", preferences.theme);
    }
  },

  // Utility methods
  getUserDisplayName(): string {
    const email = this.getUserEmail();
    if (!email) return "";

    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  // Session management
  hasValidSession(): boolean {
    const authData = this.getAuthData();
    return authData !== null && this.isAuthenticated();
  },

  // Clear all app data (for logout or account deletion)
  clearAllData(): void {
    const keysToKeep = ["preferredLanguage"]; // Keep language preference
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  },
};

/**
 * React hook for using auth storage
 * Can be used in components that need to react to auth changes
 */
export const useAuthStorage = () => {
  const checkAuth = () => authStorage.isAuthenticated();
  const getUser = () => authStorage.getAuthData();
  const logout = () => authStorage.clearAuthData();

  return {
    isAuthenticated: checkAuth,
    getUserData: getUser,
    logout,
    storage: authStorage,
  };
};
