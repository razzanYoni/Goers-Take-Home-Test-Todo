import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { ErrorType, StandardError } from "../errors/standard-error";
import { hashFingerprint } from "../utils/token";
import { NextFunction, Request, Response } from "express";
import { BlogPayload } from "../types/request";
import { UserRequest } from "../types/request";


const verifyFingerprint = async (
	fingerprint: string,
	d: BlogPayload,
): Promise<boolean> => {
	return (await hashFingerprint(fingerprint)) === d.fgp;
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.cookies["Secure-access-token"];

		if (!accessToken) {
			throw new StandardError(ErrorType.ACCESS_TOKEN_MISSING);
		}

		const fingerprint = req.cookies["Secure-fingerprint"];

		if (!fingerprint) {
			throw new StandardError(ErrorType.FINGERPRINT_MISSING);
		}

		const decodedPayload = jwt.verify(
			accessToken,
			process.env.JWT_SHARED_SECRET as string,
			{
				algorithms: ["HS256"],
				issuer: "Blog REST Service",
			},
		);

		await verifyFingerprint(fingerprint, decodedPayload as BlogPayload);

		(req as UserRequest).user = decodedPayload as BlogPayload;

		next(); // The token is verified, pass to the next middleware
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			next(new StandardError(ErrorType.ACCESS_TOKEN_EXPIRED));
		} else if (error instanceof NotBeforeError) {
			next(new StandardError(ErrorType.ACCESS_TOKEN_NOT_ACTIVE));
		} else if (error instanceof JsonWebTokenError) {
			next(new StandardError(ErrorType.INVALID_SIGNATURE));
		} else if (error instanceof StandardError) {
			next(error);
		}
		next(error);
	}
};

export { verifyToken };
