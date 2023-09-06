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

export const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
});

export const get = (resource: any, config?: AxiosRequestConfig) => {
  return axiosInstance.get(resource, config);
};

export const post = (
  resource: any,
  data?: any,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post(resource, data, config);
};

export const put = (resource: any, data: any, config?: AxiosRequestConfig) => {
  return axiosInstance.put(resource, data, config);
};

export const deleted = (resource: any, config?: AxiosRequestConfig) => {
  return axiosInstance.delete(resource, config);
};
