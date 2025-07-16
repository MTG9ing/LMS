import "express-async-errors"; // Must be first
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { morganMiddleware } from "./utilities/logger.util";
import { getLocalIp } from "./utilities/network.util";
import { SERVER_HOST, SERVER_PORT } from "./configurations/env.config";
import studentRouter from "./modules/student/student.route";
import paymentRouter from "./modules/payment/payment.route";
import categoryRouter from "./modules/category/category.route";
import paymentPlanRouter from "./modules/paymentPlan/paymentPlan.route";
import financialRecordRouter from "./modules/financialRecord/financialRecord.route";
import attendanceRouter from "./modules/attendance/attendance.route";
import parentRouter from "./modules/parent/parent.route";
import gradeLevelRouter from "./modules/gradeLevel/gradelevel.route";

const application: Express = express();

// TODO(optional): while in rate limitation timeout show the remaining time
// TODO: make all pagination DRY
// TODO: fix all controller pagination query validation and types

// Security Middlewares
application.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // Only if needed
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
// application.use(limiter); // TODO: after testing, uncomment it
application.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-school-domain.com"]
        : "*",
    //         `http://${SERVER_HOST}:${SERVER_PORT}`,
    // `http://${getLocalIp()}:5173`,
    // `http://${SERVER_HOST}:5173`,
    // `http://${SERVER_HOST}:5174`,
    // `http://${SERVER_HOST}:4123`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Performance & Parsing Middlewares
application.use(
  compression({
    threshold: 1024, // Only compress >1KB
    filter: (request) => (request.headers["x-no-compression"] ? false : true),
  })
);
application.use(express.json({ limit: "10kb" }));
application.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Custom Middlewares
application.use(morganMiddleware); // Logging

// Routes // TODO: add all routing // TODO: consider versioning
application.use("/api/students", studentRouter);
application.use("/api/payments", paymentRouter);
application.use("/api/payment-plans", paymentPlanRouter);
application.use("/api/categories", categoryRouter);
application.use("/api/financial-records", financialRecordRouter);
application.use("/api/attendance", attendanceRouter);
application.use("/api/parent", parentRouter);
application.use("/api/gradelevel", gradeLevelRouter);

export default application;
