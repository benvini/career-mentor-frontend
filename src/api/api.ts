import axios, { type AxiosResponse, type AxiosError } from "axios";
import { authStorage } from "./authStorage";
import { config } from "../config/env";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface SurveyAnswers {
  experience: string;
  interests: string[];
  skills?: string;
  goal: string;
  timeline?: string;
  budget?: string;
  language?: "en" | "he";
}

export interface Survey {
  id?: string;
  answers: SurveyAnswers;
  aiPlan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface SurveyResponse {
  aiPlan: string;
  survey: Survey;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserStats {
  totalSurveys: number;
  plansGenerated: number;
  goalsCompleted: number;
  lastActivity: string;
}

export interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "article" | "course" | "video" | "book";
  tags: string[];
}

export interface UsageAnalytics {
  period: string;
  totalRequests: number;
  activeUsers: number;
  surveysCreated: number;
  plansGenerated: number;
  peakUsageTime: string;
  averageResponseTime: number;
  errorRate: number;
}

export interface SystemStats {
  totalUsers: number;
  totalSurveys: number;
  totalPlans: number;
  systemUptime: string;
  databaseSize: string;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  lastBackup: string;
}

export interface ApiErrorData {
  error?: string;
  message?: string;
  details?: string;
  code?: string;
}

const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStorage.clearAuthData();
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  auth: {
    async login(
      credentials: LoginCredentials
    ): Promise<AxiosResponse<AuthResponse>> {
      return apiClient.post("/users/login", credentials);
    },

    async register(
      credentials: RegisterCredentials
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post("/users/register", credentials);
    },

    async refreshToken(): Promise<AxiosResponse<AuthResponse>> {
      return apiClient.post("/users/refresh");
    },

    async forgotPassword(
      email: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post("/users/forgot-password", { email });
    },

    async resetPassword(
      token: string,
      password: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post("/users/reset-password", { token, password });
    },

    async verifyEmail(
      token: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post("/users/verify-email", { token });
    },
  },

  // Surveys
  surveys: {
    async create(
      answers: SurveyAnswers
    ): Promise<AxiosResponse<SurveyResponse>> {
      return apiClient.post("/surveys", { answers });
    },

    async getAll(): Promise<AxiosResponse<Survey[]>> {
      return apiClient.get("/surveys");
    },

    async getById(id: string): Promise<AxiosResponse<Survey>> {
      return apiClient.get(`/surveys/${id}`);
    },

    async update(
      id: string,
      answers: SurveyAnswers
    ): Promise<AxiosResponse<SurveyResponse>> {
      return apiClient.put(`/surveys/${id}`, { answers });
    },

    async delete(id: string): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.delete(`/surveys/${id}`);
    },

    async regeneratePlan(id: string): Promise<AxiosResponse<SurveyResponse>> {
      return apiClient.post(`/surveys/${id}/regenerate`);
    },

    async export(
      id: string,
      format: "pdf" | "docx" | "txt"
    ): Promise<AxiosResponse<Blob>> {
      return apiClient.get(`/surveys/${id}/export/${format}`, {
        responseType: "blob",
      });
    },
  },

  // User profile
  user: {
    async getProfile(): Promise<AxiosResponse<UserProfile>> {
      return apiClient.get("/users/profile");
    },

    async updateProfile(data: {
      email?: string;
      name?: string;
    }): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.put("/users/profile", data);
    },

    async changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
    },

    async deleteAccount(): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.delete("/users/account");
    },

    async uploadAvatar(
      file: File
    ): Promise<AxiosResponse<{ avatarUrl: string }>> {
      const formData = new FormData();
      formData.append("avatar", file);
      return apiClient.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },

  // Analytics
  analytics: {
    async getUserStats(): Promise<AxiosResponse<UserStats>> {
      return apiClient.get("/analytics/user-stats");
    },

    async getRecentActivity(
      limit: number = 10
    ): Promise<AxiosResponse<ActivityItem[]>> {
      return apiClient.get(`/analytics/recent-activity?limit=${limit}`);
    },

    async getUsageAnalytics(
      period: "week" | "month" | "year"
    ): Promise<AxiosResponse<UsageAnalytics>> {
      return apiClient.get(`/analytics/usage?period=${period}`);
    },
  },

  // Resources
  resources: {
    async getRecommended(): Promise<AxiosResponse<Resource[]>> {
      return apiClient.get("/resources/recommended");
    },

    async searchResources(
      query: string,
      type?: string
    ): Promise<AxiosResponse<Resource[]>> {
      const params = new URLSearchParams({ query });
      if (type) params.append("type", type);
      return apiClient.get(`/resources/search?${params}`);
    },

    async getResourcesByCategory(
      category: string
    ): Promise<AxiosResponse<Resource[]>> {
      return apiClient.get(`/resources/category/${category}`);
    },

    async bookmarkResource(
      resourceId: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.post(`/resources/${resourceId}/bookmark`);
    },

    async getBookmarkedResources(): Promise<AxiosResponse<Resource[]>> {
      return apiClient.get("/resources/bookmarked");
    },
  },

  // Admin endpoints (for future use)
  admin: {
    async getAllUsers(): Promise<AxiosResponse<UserProfile[]>> {
      return apiClient.get("/admin/users");
    },

    async getUserById(userId: string): Promise<AxiosResponse<UserProfile>> {
      return apiClient.get(`/admin/users/${userId}`);
    },

    async deleteUser(
      userId: string
    ): Promise<AxiosResponse<{ message: string }>> {
      return apiClient.delete(`/admin/users/${userId}`);
    },

    async getSystemStats(): Promise<AxiosResponse<SystemStats>> {
      return apiClient.get("/admin/stats");
    },
  },
};

export { apiClient };

export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === "object") {
    const errorData = error.response.data as ApiErrorData;
    return errorData.error || errorData.message || "An error occurred";
  }
  return error.message || "Network error occurred";
};
