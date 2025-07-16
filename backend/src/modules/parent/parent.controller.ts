import { Request, Response, NextFunction } from "express";
import { ParentService } from "./parent.service";
import prisma from "../../configurations/prisma.config";
import { CreateParentSchema, UpdateParentSchema } from "./parent.validation";
import { Prisma } from "../../generated/prisma";

const service = new ParentService(prisma);

export class ParentController {
  // * DONE
  static async createParent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const validatedData = CreateParentSchema.parse(request.body);
    const parent = await service.create(validatedData);
    response.status(201).json(parent);
  }

  // * DONE
  static async getAllParents(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const query = {
      page: parseInt(request.query.page as string) || 1,
      limit: parseInt(request.query.limit as string) || 10,
      order:
        (request.query.order as keyof Prisma.ParentOrderByWithRelationInput) ||
        "name",
      sort: (request.query.sort as "asc" | "desc") || "desc",
    };
    const parents = await service.all(query);
    response.status(200).json(parents);
  }

  // * DONE
  static async getParentById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const parent = await service.byId(request.params.id);
    response.status(200).json(parent);
  }

  // * DONE
  static async updateParent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const validatedData = UpdateParentSchema.parse(request.body);
    const parent = await service.update(request.params.id, validatedData);
    response.status(200).json(parent);
  }

  // * DONE
  static async deleteParent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const parent = await service.delete(request.params.id);
    response.status(200).json(parent);
  }
}
