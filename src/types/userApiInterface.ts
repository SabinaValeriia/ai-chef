export interface CreateUserInterface {
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface AuthUserInterface {
  identifier: string;
  password: string;
}
