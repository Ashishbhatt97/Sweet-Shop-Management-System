export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: userRoles;
  active: boolean;
  refreshToken: string;
}

export enum userRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}
