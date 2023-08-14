import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
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
