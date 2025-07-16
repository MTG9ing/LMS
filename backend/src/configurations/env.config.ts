import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z.string().default("3000"),
  SERVER_HOST: z.string().default("localhost"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ENCRYPTION_KEY: z
    .string()
    .default(
      "bffae0bb33799baaec7909978b8a39f31ed28edaea135fe80b10c68a4ecaf526"
    ),
  TAX_RATE: z
    .string()
    .transform((val) => parseFloat(val))
    .default("0.14"),
});

export const { SERVER_PORT, SERVER_HOST, NODE_ENV, ENCRYPTION_KEY, TAX_RATE } =
  envSchema.parse(process.env);
