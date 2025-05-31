-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SALES_MAKER', 'SALES_CHECKER');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('GOLD_LOAN', 'HOME_LOAN', 'BUSINESS_LOAN', 'PERSONAL_LOAN');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('DRAFT', 'FORM_SUBMITTED', 'LOAN_APPROVED', 'LOAN_REJECTED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATED', 'SAVED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'KYC_VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "custId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "aadharNumber" TEXT,
    "panNumber" TEXT,
    "kycVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tempAppId" TEXT,
    "appId" TEXT,
    "pincode" TEXT NOT NULL,
    "loanType" "LoanType" NOT NULL,
    "status" "AppStatus" NOT NULL DEFAULT 'DRAFT',
    "formData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "comment" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_custId_key" ON "Customer"("custId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_leadId_key" ON "Application"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_tempAppId_key" ON "Application"("tempAppId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_appId_key" ON "Application"("appId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
