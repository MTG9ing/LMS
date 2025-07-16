import { v4 as uuidv4 } from "uuid";
import prisma from "../configurations/prisma.config";

export const generateStudentNumber = async (): Promise<string> => {
  const MAX_RETRIES = 5;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const candidate = `STU-${uuidv4().slice(0, 8)}`;
    const existing = await prisma.student.findUnique({
      where: { studentNumber: candidate },
    });
    if (!existing) return candidate;
  }

  throw new Error("Failed to generate a unique student number");
};
