import axios from "axios";

const httpAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

httpAxios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpAxios.interceptors.response.use(
  function (response) {
    // Return only the response data by default
    return response.data;
  },
  function (error) {
    // Handle 401 or token-expired errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally, show a message to the user here
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default httpAxios;
