import { Request, Response, NextFunction } from "express";
import { PaymentPlanService } from "./paymentPlan.service";
import {
  CreatePaymentPlanSchema,
  UpdatePaymentPlanSchema,
} from "./paymentPlan.validation";
import {
  CreatePaymentPlanInput,
  UpdatePaymentPlanInput,
} from "./paymentPlan.dto";
import prisma from "../../configurations/prisma.config";

const service = new PaymentPlanService(prisma);
export class PaymentPlanController {
  // * DONE
  static async getAllPaymentPlans(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const paymentPlans = await service.all(request.query);
      response.status(200).json(paymentPlans);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async createPaymentPlan(
    request: Request<{}, {}, CreatePaymentPlanInput>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const validatedData = CreatePaymentPlanSchema.parse(request.body);

      const paymentPlan = await service.create(validatedData);
      response.status(201).json(paymentPlan);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async getPaymentPlanById(
    request: Request<{ id: string }, {}, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const paymentPlan = await service.byId(request.params.id);
      response.status(200).json(paymentPlan);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async updatePaymentPlan(
    request: Request<{ id: string }, {}, UpdatePaymentPlanInput>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const validatedData = UpdatePaymentPlanSchema.parse(request.body);

      const paymentPlan = await service.update(
        request.params.id,
        validatedData
      );
      response.status(200).json(paymentPlan);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async deletePaymentPlan(
    request: Request<{ id: string }, {}, {}>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const paymentPlan = await service.delete(request.params.id);
      response.status(200).json(paymentPlan);
    } catch (error) {
      next(error);
    }
  }

  // static async searchPaymentPlan(
  //   request: Request<{}, {}, {}, PaymentPlanQuery>,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const validatedQuery = PaymentPlanQuerySchema.parse(request.query);

  //     const paymentPlans = await PaymentPlanService.search(validatedQuery);
  //     response.status(200).json(paymentPlans);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
