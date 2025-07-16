import { AppError } from "./App.error";

export class DatabaseError extends AppError {
  constructor(
    message: string = "Database Internal Error",
    public operation: string
  ) {
    super(message, 500);
  }
}
