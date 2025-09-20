import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import dotenv from "dotenv";
import { Request } from "express";
import prisma from "./prismaClient";

dotenv.config();

interface JwtPayload {
  id: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(
    options,
    async (_req: Request, jwt_payload: JwtPayload, done: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwt_payload.id,
          },
        });

        if (!user) throw new Error("Unauthorized: Invalid token");

        const { password, ...rest } = user;

        if (user) return done(null, rest);
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
