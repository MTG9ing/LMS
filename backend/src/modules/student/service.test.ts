import { StudentService } from "./student.service";
import prisma from "../../configurations/prisma.config";
import { NotFoundError } from "../../Errors/NotFound.error";
import { ConflictError } from "../../Errors/Conflict.error";
import { encrypt, decrypt } from "../../utilities/encrypt.util";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../configurations/prisma.config");
jest.mock("../../utilities/encrypt.util", () => ({
  encrypt: jest.fn().mockImplementation((s: string) => `ENC(${s})`),
  decrypt: jest
    .fn()
    .mockImplementation((s: string) => s.replace(/^ENC\((.*)\)$/, "$1")),
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("StudentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("healthCheck", () => {
    it("returns OK when DB responds", async () => {
      prismaMock.$queryRaw.mockResolvedValueOnce(1 as any);
      const res = await StudentService.healthCheck();
      expect(res?.status).toBe("OK");
      expect(res?.database).toBe("CONNECTED");
    });

    it("returns ERROR when DB throws", async () => {
      prismaMock.$queryRaw.mockRejectedValueOnce(new Error("nope"));
      const res = await StudentService.healthCheck();
      expect(res?.status).toBe("ERROR");
      expect(res?.database).toBe("DISCONNECTED");
      expect(res?.error).toBe("nope");
    });
  });

  describe("bulkArchive", () => {
    it("disables plans and archives students", async () => {
      const fakeTx = {
        paymentPlan: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
        student: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      const result = await StudentService.bulkArchive(["A", "B"]);
      expect(fakeTx.paymentPlan.updateMany).toHaveBeenCalled();
      expect(fakeTx.student.updateMany).toHaveBeenCalled();
      expect(result).toEqual({ count: 2 });
    });
  });

  describe("createStudent", () => {
    const input = {
      fullName: "Alice",
      studentNumber: "SN001",
      gradeLevelId: "G1",
      // leave out parentId/paymentPlanId to test optional
    } as any;
    it("encrypts notes & lowercases number", async () => {
      const fakeTx = {
        validateStudentCreation: jest.fn(),
        student: {
          create: jest
            .fn()
            .mockResolvedValue({ id: "X", ...input, sensitiveNotes: "ENC(x)" }),
        },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      const out = await StudentService.createStudent({
        ...input,
        sensitiveNotes: "x",
      });
      expect(encrypt).toHaveBeenCalledWith("x");
      expect(fakeTx.student.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            studentNumber: "sn001",
            sensitiveNotes: "ENC(x)",
          }),
        })
      );
      expect(out.id).toBe("X");
    });

    it("throws if validation fails", async () => {
      // Simulate our validate checking paymentPlanId which we didn't supply
      // So it should succeed. For error, mock validateStudentCreation itself:
      const fakeTx = {
        validateStudentCreation: jest
          .fn()
          .mockRejectedValue(new NotFoundError("pland")),
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      await expect(StudentService.createStudent(input)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getStudentById", () => {
    it("throws if not found", async () => {
      prismaMock.student.findUnique.mockResolvedValueOnce(null);
      await expect(StudentService.getStudentById("no")).rejects.toThrow(
        NotFoundError
      );
    });

    it("decrypts notes on return", async () => {
      prismaMock.student.findUnique.mockResolvedValueOnce({
        id: "1",
        fullName: "Bob",
        sensitiveNotes: "ENC(secret)",
        parent: null,
        gradeLevel: null,
        exams: [],
        paymentPlan: null,
        payments: [],
        homework: [],
        behaviors: [],
        achievements: [],
      } as any);
      const s = await StudentService.getStudentById("1");
      expect(decrypt).toHaveBeenCalledWith("ENC(secret)");
      expect(s.sensitiveNotes).toBe("secret");
    });
  });

  describe("updateStudent", () => {
    it("updates & encrypts notes", async () => {
      const fakeTx = {
        student: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: "1", studentNumber: "orig" }),
          update: jest.fn().mockResolvedValue({
            id: "1",
            fullName: "New",
            sensitiveNotes: "ENC(n)",
          }),
        },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      const res = await StudentService.updateStudent("1", {
        fullName: "New",
        sensitiveNotes: "n",
      });
      expect(encrypt).toHaveBeenCalledWith("n");
      expect(fakeTx.student.update).toHaveBeenCalled();
      expect(res.fullName).toBe("New");
    });

    it("throws if no existing student", async () => {
      const fakeTx = {
        student: { findUnique: jest.fn().mockResolvedValue(null) },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      await expect(
        StudentService.updateStudent("1", { fullName: "X" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteStudent", () => {
    it("archives the student after deleting deps", async () => {
      const fakeTx = {
        payment: { deleteMany: jest.fn() },
        behavior: { deleteMany: jest.fn() },
        homework: { deleteMany: jest.fn() },
        examAttempt: { deleteMany: jest.fn() },
        achievement: { deleteMany: jest.fn() },
        student: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: "1", studentNumber: "SN" }),
          update: jest.fn().mockResolvedValue({
            id: "1",
            isArchived: true,
            sensitiveNotes: null,
          }),
        },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      const out = await StudentService.deleteStudent("1");
      expect(out.isArchived).toBe(true);
      expect(fakeTx.student.update).toHaveBeenCalled();
    });

    it("throws if student not found", async () => {
      const fakeTx = {
        payment: {},
        behavior: {},
        homework: {},
        examAttempt: {},
        achievement: {},
        student: { findUnique: jest.fn().mockResolvedValue(null) },
      } as any;
      prismaMock.$transaction.mockImplementationOnce((fn) => fn(fakeTx));
      await expect(StudentService.deleteStudent("1")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
