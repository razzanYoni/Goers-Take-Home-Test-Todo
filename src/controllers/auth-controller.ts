import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as AuthService from '../services/auth-service';
import { UserRequest } from '../types/request';
import { generateResponse } from '../utils/response';

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = req as UserRequest;
    generateResponse(res, StatusCodes.OK, {
      message: "Token is valid",
    });
  } catch (err) {
    next(err);
  }
}

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const createdUser = await AuthService.signup(req.body);
    generateResponse(res, StatusCodes.CREATED, createdUser);
  } catch (err) {
    next(err);
  }
};

// The storage of tokens on the client side follows the recommendations provided by OWASP
// https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-storage-on-client-side
const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessTokenAndFingerPrint = await AuthService.login(req.body);
    setFingerprintCookie(res, accessTokenAndFingerPrint.fingerprint);
    setJWTCookie(res, accessTokenAndFingerPrint.accessToken);
    generateResponse(res, StatusCodes.OK,
      // todo: remove this later
      {
        accessToken: accessTokenAndFingerPrint.accessToken,
        fingerprint: accessTokenAndFingerPrint.fingerprint,
      }
    );
  } catch (err) {
    next(err);
  }
};

const setJWTCookie = (
  res: Response,
  accessToken: string,
): void => {
  res.cookie("Secure-access-token", accessToken, {
    maxAge: 60 * 60 * 1000, // 60 minutes max age
    httpOnly: true,
    secure: true,
  });
}

const setFingerprintCookie = (
  res: Response,
  fingerprint: string,
): void => {
  res.cookie("Secure-fingerprint", fingerprint, {
    maxAge: 60 * 60 * 1000, // 60 minutes max age (same as access token expiry)
    httpOnly: true,
    secure: true,
  });
};

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("Secure-access-token");
    res.clearCookie("Secure-fingerprint");
    generateResponse(res, StatusCodes.OK, { message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export { verifyToken, signup, login, logout };
