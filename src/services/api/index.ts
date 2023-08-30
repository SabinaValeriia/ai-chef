import axios, { AxiosRequestConfig } from "axios";
import { ref } from "vue";

const isAuthenticated = ref(false);

function getJwtToken(): any {
  if (isAuthenticated.value) {
    const jwt = localStorage.getItem("isAuthenticated");
    return jwt;
  } else {
    return "";
  }
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
});

const ApiService = {
  get(resource: any, config?: AxiosRequestConfig) {
    return axiosInstance.get(resource, config);
  },

  post(resource: any, data?: any, config?: AxiosRequestConfig) {
    return axiosInstance.post(resource, data, config);
  },

  put(resource: any, data: any, config?: AxiosRequestConfig) {
    return axiosInstance.put(resource, data, config);
  },

  delete(resource: any, config?: AxiosRequestConfig) {
    return axiosInstance.delete(resource, config);
  },
};

export default ApiService;
