import express, { Router } from 'express';

import * as TodoController from '../controllers/todo-controller';
import { verifyToken } from '../middlewares/verify-token';

const todoRouter: Router = express.Router();

todoRouter
  .route("/")
  .get(
    verifyToken,
    TodoController.searchTodoOwned,
  )
  .post(
    verifyToken,
    TodoController.createTodo,
  )


todoRouter
  .route("/:todoId")
  .get(
    verifyToken,
    TodoController.getTodoById,
  )
  .put(
    verifyToken,
    TodoController.editTodo,
  )
  .delete(
    verifyToken,
    TodoController.deleteTodo,
  )


export { todoRouter };