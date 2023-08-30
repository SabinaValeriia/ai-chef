import {
  AuthUserInterface,
  CreateUserInterface,
  ResUser,
} from "@/types/userApiInterface";
import ApiService from "../api";
import { AxiosResponse } from "axios";

const userApi = {
  registerUser(userData: CreateUserInterface) {
    return ApiService.post("auth/local/register", userData);
  },
  loginUser(userData: AuthUserInterface) {
    return ApiService.post("auth/local", userData);
  },
  showUsers(headers: object): Promise<AxiosResponse<{ data: ResUser }>> {
    return ApiService.get("users/me?populate=*", headers);
  },
  updateUser(usersId: number, usersData: string, headers?: object) {
    return ApiService.put(`users/${usersId}`, usersData, headers);
  },
};

export default userApi;
