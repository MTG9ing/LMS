import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import prisma from "../../configurations/prisma.config";

const service = new PaymentService(prisma);
export class PaymentController {
  // * DONE
  static async createPayment(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const payment = await service.create(request.body);
      response.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async getAllPayments(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const payments = await service.all(request.query);
      response.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async updatePayment(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const payment = await service.update(request.params.id, request.body);
      response.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async deletePayment(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      await service.delete(request.params.id);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
