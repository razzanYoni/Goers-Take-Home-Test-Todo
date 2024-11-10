import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as TodoService from '../services/todo-service';
import { UserRequest } from '../types/request';
import { generateResponse } from '../utils/response';

const createTodo = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userRequest = req as UserRequest;
		const data = req.body;
		const userId = userRequest.user.uid;
		const responseData = await TodoService.createTodo(data, userId);
		generateResponse(res, StatusCodes.CREATED, responseData);
	} catch (err) {
		next(err);
	}
};

const getTodoById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todoId = Number(req.params.todoId);
		const responseData = await TodoService.getTodoById(
			todoId,
		);
		generateResponse(res, StatusCodes.OK, responseData);
	} catch (err) {
		next(err);
	}
}

const searchTodoOwned = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userRequest = req as UserRequest;

		const userId = userRequest.user.uid;
		const allTodoOwned = await TodoService.searchTodoOwned(
			userId,
			{
				category: req.query.category ? String(req.query.category) : undefined,
				priority: req.query.priority ? String(req.query.priority) : undefined,
				completed: req.query.completed ? String(req.query.completed) : undefined,
				dueDateOrder: req.query.dueDateOrder ? String(req.query.dueDateOrder) : undefined,
				size: req.query.size ? Number(req.query.size) : undefined,
				page: req.query.page ? Number(req.query.page) : undefined,
			},
		);
		generateResponse(res, StatusCodes.OK, allTodoOwned);
	} catch (err) {
		next(err);
	}
}

const editTodo = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userRequest = req as UserRequest;

		const data = req.body;
		const todoId = Number(req.params.todoId);
		const userId = userRequest.user.uid;
		const updatedPost = await TodoService.editTodo(
			data,
			todoId,
			userId,
		);
		generateResponse(res, StatusCodes.OK, updatedPost);
	} catch (err) {
		next(err);
	}
};

const deleteTodo = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userRequest = req as UserRequest;

		const todoId = Number(req.params.todoId);
		const userId = userRequest.user.uid;
		const deletedTodo =
			await TodoService.deleteTodo(todoId, userId);
		generateResponse(res, StatusCodes.OK, deletedTodo);
	} catch (err) {
		next(err);
	}
};

export {
	createTodo,
	getTodoById,
	searchTodoOwned,
	editTodo,
	deleteTodo,
};
