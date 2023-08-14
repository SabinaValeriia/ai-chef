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
};

export default userApi;
