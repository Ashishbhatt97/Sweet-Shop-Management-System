import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./app/route";
import { IUser } from "./app/auth/auth.dto";
import errorHandler from "./app/common/middleware/errorHandler";
import passport from "./app/config/passport";
import morgan from "morgan";

dotenv.config();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
