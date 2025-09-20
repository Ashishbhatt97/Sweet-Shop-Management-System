import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import * as userServices from "./auth.services";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);
  res.send(createResponse(result, "User created successfully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated successfully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.getUserById(req.params.id);
  res.send(createResponse(result));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.loginUser(req.body);
  res.send(createResponse(result));
});

export const getUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }

    const result = await userServices.getUserDetails(req.user?.id as string);
    res.send(createResponse(result));
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await userServices.refreshAccessTokenService(refreshToken);

    res.send(createResponse(result));
  }
);
