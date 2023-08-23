import {
  AuthUserInterface,
  CreateUserInterface,
} from "@/types/userApiInterface";
import ApiService from "../api";

const userApi = {
  registerUser(userData: CreateUserInterface) {
    return ApiService.post("auth/local/register", userData);
  },
  loginUser(userData: AuthUserInterface) {
    return ApiService.post("auth/local", userData);
  },
  showUsers(headers: any) {
    return ApiService.get("users/me?populate=*", headers);
  },
  updateUser(usersId: number, usersData: string, headers?: any) {
    return ApiService.put(`users/${usersId}`, usersData, headers);
  },
};

export default userApi;
