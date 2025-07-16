import { Request, Response, NextFunction } from "express";
import { StudentService } from "./student.service";
import prisma from "../../configurations/prisma.config";
import { Prisma } from "../../generated/prisma";

const service = new StudentService(prisma);

export class StudentController {
  // * DONE
  static async createStudent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const student = await service.create(request.body);
    response.status(201).json(student);
  }

  // * DONE
  static async getAllStudents(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const {
      page,
      limit,
      isStillAttending,
      isOnline,
      gradeLevelId,
      order,
      sort,
      search,
    } = request.query;
    const students = await service.all({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      gradeLevelId:
        gradeLevelId !== "all" && gradeLevelId !== ""
          ? gradeLevelId?.toString()
          : undefined,
      isStillAttending:
        isStillAttending !== "all" && isStillAttending !== ""
          ? isStillAttending == "true"
          : undefined,
      isOnline:
        isOnline !== "all" && isOnline !== "" ? isOnline == "true" : undefined,
      order: order?.toString() as keyof Prisma.StudentOrderByWithRelationInput,
      sort: sort?.toString() as "asc" | "desc",
      search: search?.toString(),
    });

    response.status(200).json(students);
  }

  // * DONE
  static async getStudentById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const student = await service.byId(request.params.id);
    response.status(200).json(student);
  }

  // TODO: Still not finished
  // static async searchStudents(
  //   request: Request<
  //     {},
  //     {},
  //     {},
  //     { query: string; options?: { page: string; limit: string } }
  //   >,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { query, options } = request.query;
  //     if (!query || typeof query !== "string") {
  //       return response
  //         .status(400)
  //         .json({ message: "Search query is required" });
  //     }
  //     const parsedOptions = {
  //       page: options?.page ? parseInt(options.page, 10) : 1,
  //       limit: options?.limit ? parseInt(options.limit, 10) : 10,
  //     };
  //     const students = search(query, parsedOptions);
  //     response.status(200).json(students);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // * DONE
  static async updateStudent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const student = await service.update(request.params.id, request.body);
    response.status(200).json(student);
  }

  // * DONE
  static async deleteStudent(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const student = await service.delete(request.params.id);
    response.status(200).json(student);
  }
}
