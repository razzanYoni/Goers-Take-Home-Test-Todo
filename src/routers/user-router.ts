import express, { Router } from 'express';

import * as UserController from '../controllers/user-controller';
import { verifyToken } from '../middlewares/verify-token';

const userRouter: Router = express.Router();

userRouter
	.route("/profile")
	.get(verifyToken, UserController.userProfile);


export { userRouter };