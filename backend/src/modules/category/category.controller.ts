import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import prisma from "../../configurations/prisma.config";

const service = new CategoryService(prisma);
export class CategoryController {
  // * DONE
  static async getAllCategories(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const categories = await service.all(request.query);
      response.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async getCategoryById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const category = await service.byId(request.params.id);
      response.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  // static async getCategoryByName(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const category = await service.byName(request.params.name);
  //     response.status(200).json(category);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async searchCategories(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { query, ...options } = req.query;
  //     if (!query || typeof query !== "string") {
  //       return res.status(400).json({ message: "Search query is required" });
  //     }

  //     const categories = await CategoryService.search(query, options);
  //     res.status(200).json(categories);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // * DONE
  static async createCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const newCategory = await service.create(request.body);
      response.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async updateCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const updatedCategory = await service.update(
        request.params.id,
        request.body
      );
      response.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async deleteCategory(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const deletedCategory = await service.delete(request.params.id);
      response.status(200).json(deletedCategory);
    } catch (error) {
      next(error);
    }
  }
}
