import { AppError } from "../Errors/App.error";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utilities/logger.util";
import { NODE_ENV } from "../configurations/env.config";
import { ConflictError } from "../Errors/Conflict.error";
import { NotFoundError } from "../Errors/NotFound.error";
import { ZodError } from "zod";
import { DatabaseError } from "../Errors";
import { buildErrorResponse } from "../utilities/responses/error.util";

export const errorHandler = (
  error:
    | unknown
    | NotFoundError
    | ConflictError
    | DatabaseError
    | Error
    | ZodError
    | AppError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let stack: string | undefined;

  if (error instanceof NotFoundError) {
    statusCode = 404;
    message = error.message;
  } else if (error instanceof ConflictError) {
    statusCode = 409;
    message = error.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode || 500;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    stack = error.flatten
      ? JSON.stringify(error.flatten(), null, 2)
      : undefined;
  } else {
    message = `Unknown Error Occurred: ${String(error)}`;
  }

  // Logging with error details
  logger.error({
    message,
    statusCode,
    path: request.path,
    method: request.method,
    stack: NODE_ENV === "development" ? stack : undefined,
  });

  // Client response
  response.status(statusCode).json(
    buildErrorResponse(message, {
      error,
      ...(NODE_ENV === "development" && { stack }),
    })
  );
};
