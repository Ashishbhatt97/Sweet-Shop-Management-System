import BaseSchema from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  username: string;
  password: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  refreshToken: string;
}
