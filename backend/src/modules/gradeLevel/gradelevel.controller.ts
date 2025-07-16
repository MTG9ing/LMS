import { Request, Response, NextFunction } from "express";
import { GradeLevelService } from "./gradelevel.service";
import prisma from "../../configurations/prisma.config";
import { Prisma } from "../../generated/prisma";
import {
  CreateGradeLevelSchema,
  UpdateGradeLevelSchema,
} from "./gradelevel.validation";

const service = new GradeLevelService(prisma);

export class GradeLevelController {
  // * DONE
  static async getAllGradeLevels(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const query = {
      page: parseInt(request.query.page as string) || 1,
      limit: parseInt(request.query.limit as string) || 10,
      order:
        (request.query
          .order as keyof Prisma.GradeLevelOrderByWithRelationInput) || "name",
      sort: (request.query.sort as "asc" | "desc") || "desc",
    };

    const gradelevels = await service.all(query);
    response.status(200).json(gradelevels);
  }

  // * DONE
  static async getGradeLevelById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const gradelevel = await service.byId(request.params.id);
    response.status(200).json(gradelevel);
  }

  // * DONE
  static async createGradeLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const validatedData = CreateGradeLevelSchema.parse(request.body);
    const gradelevel = await service.create(validatedData);
    response.status(201).json(gradelevel);
  }

  // * DONE
  static async updateGradeLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const validatedData = UpdateGradeLevelSchema.parse(request.body);
    const gradelevel = await service.update(request.params.id, validatedData);
    response.status(200).json(gradelevel);
  }

  // * DONE
  static async deleteGradeLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const gradelevel = await service.delete(request.params.id);
    response.status(200).json(gradelevel);
  }
}
