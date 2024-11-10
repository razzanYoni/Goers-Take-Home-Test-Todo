import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as CategoryService from '../services/category-services';
import { UserRequest } from '../types/request';
import { generateResponse } from '../utils/response';

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    const userId: number = userRequest.user.uid;

    const data = req.body;

    const responseData = await CategoryService.createCategory(data, userId);
    generateResponse(res, StatusCodes.CREATED, responseData);
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    const userId = userRequest.user.uid;

    const categoryId = Number(req.params.categoryId);

    const responseData = await CategoryService.getCategoryById(userId, categoryId);
    generateResponse(res, StatusCodes.OK, responseData);
  } catch (err) {
    next(err);
  }
}

const searchCategoryOwned = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    const userId = userRequest.user.uid;

    const responseData = await CategoryService.searchCategoryOwned(userId, {
      asc: req.query.asc ? String(req.query.asc) : undefined,
    });
    generateResponse(res, StatusCodes.OK, responseData);
  } catch (err) {
    next(err);
  }
};

const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    const userId = userRequest.user.uid;

    const data = req.body;
    const categoryId = Number(req.params.categoryId);

    const responseData = await CategoryService.updateCategory(data, categoryId, userId);
    generateResponse(res, StatusCodes.OK, responseData);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    const userId = userRequest.user.uid;

    const categoryId = Number(req.params.categoryId);

    const responseData = await CategoryService.deleteCategory(categoryId, userId);
    generateResponse(res, StatusCodes.OK, responseData);
  } catch (err) {
    next(err);
  }
};


export {
  createCategory,
  getCategoryById,
  searchCategoryOwned,
  editCategory,
  deleteCategory,
};
