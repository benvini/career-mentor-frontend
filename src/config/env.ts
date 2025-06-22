export const config = {
  apiUrl: import.meta.env?.VITE_API_URL || "http://localhost:4000/api",
  isProd: import.meta.env?.PROD || false,
  isDev: import.meta.env?.DEV || true,
};
