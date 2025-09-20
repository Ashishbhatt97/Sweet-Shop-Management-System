import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import prisma from "../../config/prismaClient";

config();

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";

export const generateTokens = async (data: {
  id: string;
  email: string;
  role: string;
}) => {
  const accessToken = jwt.sign(data, accessTokenSecret, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(data, refreshTokenSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    if (!payload) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid or expired refresh token");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    return { accessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
