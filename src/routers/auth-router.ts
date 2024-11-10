import express, { Router } from "express";
import * as AuthController from "../controllers/auth-controller";
import { verifyToken } from "../middlewares/verify-token";

const authRouter: Router = express.Router();

authRouter.post(
  "/verify-token",
  verifyToken,
  AuthController.verifyToken,
)

authRouter.post(
  "/signup",
  AuthController.signup,
);

authRouter.post(
  "/login",
  AuthController.login,
);

authRouter.post(
  "/logout",
  AuthController.logout,
);

export { authRouter };
