import {
  AuthUserInterface,
  CreateUserInterface,
  ResUser,
} from "@/types/userApiInterface";
import { axiosInstance } from "../api";
import { AxiosResponse } from "axios";

export const registerUser = (userData: CreateUserInterface) => {
  return axiosInstance.post("auth/local/register", userData);
};
export const loginUser = (userData: AuthUserInterface) => {
  return axiosInstance.post("auth/local", userData);
};
export const showUsers = (
  headers: object
): Promise<AxiosResponse<{ data: ResUser }>> => {
  return axiosInstance.get("users/me?populate=*", headers);
};
export const updateUser = (
  usersId: number,
  usersData: string,
  headers?: object
) => {
  return axiosInstance.put(`users/${usersId}`, usersData, headers);
};
