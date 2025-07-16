-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isStillAttending" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" JSONB,
    "sensitiveNotes" TEXT,
    "parentId" TEXT,
    "paymentPlanId" TEXT
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "email" TEXT,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "fullGrade" REAL NOT NULL,
    "gradeLevelId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExamSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentGrade" REAL,
    "submittedAt" DATETIME,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HomeworkTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "gradeLevelId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "studentGrade" REAL,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME,
    "studentId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Behavior" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "score" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "awardedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "studentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "category" TEXT NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT,
    "planId" TEXT
);

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxAmount" REAL,
    "paymentId" TEXT
);

-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MONTHLY',
    "amount" REAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "daysUntilDue" INTEGER NOT NULL DEFAULT 7,
    "overduePenalty" REAL DEFAULT 0,
    "installments" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");

-- CreateIndex
CREATE INDEX "Student_isStillAttending_idx" ON "Student"("isStillAttending");

-- CreateIndex
CREATE INDEX "Student_createdAt_idx" ON "Student"("createdAt");

-- CreateIndex
CREATE INDEX "Student_parentId_idx" ON "Student"("parentId");

-- CreateIndex
CREATE INDEX "Student_paymentPlanId_idx" ON "Student"("paymentPlanId");

-- CreateIndex
CREATE INDEX "Student_gradeLevelId_idx" ON "Student"("gradeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_name_key" ON "GradeLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_order_key" ON "GradeLevel"("order");

-- CreateIndex
CREATE INDEX "GradeLevel_order_isActive_idx" ON "GradeLevel"("order", "isActive");

-- CreateIndex
CREATE INDEX "GradeLevel_name_idx" ON "GradeLevel"("name");

-- CreateIndex
CREATE INDEX "Exam_gradeLevelId_idx" ON "Exam"("gradeLevelId");

-- CreateIndex
CREATE INDEX "Exam_startsAt_idx" ON "Exam"("startsAt");

-- CreateIndex
CREATE INDEX "ExamSubmission_studentId_idx" ON "ExamSubmission"("studentId");

-- CreateIndex
CREATE INDEX "ExamSubmission_examId_idx" ON "ExamSubmission"("examId");

-- CreateIndex
CREATE INDEX "HomeworkTemplate_dueDate_gradeLevelId_idx" ON "HomeworkTemplate"("dueDate", "gradeLevelId");

-- CreateIndex
CREATE INDEX "Homework_studentId_idx" ON "Homework"("studentId");

-- CreateIndex
CREATE INDEX "Homework_templateId_idx" ON "Homework"("templateId");

-- CreateIndex
CREATE INDEX "Behavior_studentId_idx" ON "Behavior"("studentId");

-- CreateIndex
CREATE INDEX "Behavior_type_createdAt_idx" ON "Behavior"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_paymentDate_category_idx" ON "Payment"("paymentDate", "category");

-- CreateIndex
CREATE INDEX "Payment_studentId_paymentDate_idx" ON "Payment"("studentId", "paymentDate");

-- CreateIndex
CREATE INDEX "FinancialRecord_date_type_idx" ON "FinancialRecord"("date", "type");

-- CreateIndex
CREATE INDEX "PaymentPlan_startDate_isActive_idx" ON "PaymentPlan"("startDate", "isActive");
