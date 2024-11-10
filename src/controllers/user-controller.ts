import { UserRequest } from '../types/request';
import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user-service";
import { generateResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

const userProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const UserRequest = req as UserRequest;
    const userId = UserRequest.user.uid;
    const user = await UserService.getUserProfile(userId);
    generateResponse(res, StatusCodes.OK, user);
  } catch (err) {
    next(err);
  }
}

export { userProfile };