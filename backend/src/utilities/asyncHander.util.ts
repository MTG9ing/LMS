import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
  fn: (request: Request, response: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    return Promise.resolve(fn(request, response, next)).catch(next);
  };
}
