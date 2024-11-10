import {NextFunction, Request, Response} from "express";
import {StandardError} from "../errors/standard-error";
import {generateStandardErrorResponse} from "../utils/response";

const handleStandardError = (
    err: StandardError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!(err instanceof StandardError)) {
        next(err); // Pass to the default error-handling middleware (provided by Express)
    } else {
        generateStandardErrorResponse(res, err);
    }
};

export {handleStandardError};
