import { AppError } from "./App.error";

export class ValidationError extends AppError {
  constructor(
    message: string = "Inputed Data is not as Validation Rule!",
    type: string
  ) {
    super(message, 400);
  }
}
