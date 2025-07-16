import { AppError } from "./App.error";

export class ConflictError extends AppError {
  constructor(message: string, public member: string) {
    super(message, 409);
  }
}
