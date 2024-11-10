import express from 'express';

import { authRouter } from './auth-router';
import { categoryRouter } from './category-router';
import { todoRouter } from './todo-router';
import { userRouter } from './user-router';

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/todo", todoRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/user", userRouter)

export default apiRouter;
