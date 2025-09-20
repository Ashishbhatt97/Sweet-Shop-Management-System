import prisma from "../config/prismaClient";
import { IUser } from "./auth.dto";
import bcrypt from "bcrypt";
import {
  generateTokens,
  refreshAccessToken,
} from "../common/services/generateTokens";

export const createUser = async (data: IUser) => {
  const isUserExists = await userExists(data.email);

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const result = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: await hashPassword(data.password),
      role: data.role,
    },
  });

  const { password, ...user } = result;
  return user;
};
export const updateUser = async (id: string, data: IUser) => {
  const result = await prisma.user.update({
    where: { id },
    data,
  });
  return result;
};

export const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });
  return result;
};

export const userExists = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
  });
  return result;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

export const loginUser = async (data: IUser) => {
  const user = await userExists(data.email);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await comparePassword(data.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid crendentials");
  }

  const tokens = await generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });
  const { password, ...rest } = updatedUser;

  return {
    ...rest,
    accessToken: tokens.accessToken,
  };
};

export const getUserDetails = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
  });
  if (!result) {
    throw new Error("User not found");
  }

  const { password, ...rest } = result;
  return rest;
};

export const refreshAccessTokenService = (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const accessToken = refreshAccessToken(refreshToken);
  return accessToken;
};
