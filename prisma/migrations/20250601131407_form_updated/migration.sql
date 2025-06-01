-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActionType" ADD VALUE 'FORM_UPDATED';
ALTER TYPE "ActionType" ADD VALUE 'STATUS_CHANGED';

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_applicationId_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "action" TEXT,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "lastUpdatedBy" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "submittedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "AccountDetails" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "accountNo" TEXT,
    "accountType" TEXT,
    "accountHolderName" TEXT,
    "companyName" TEXT,
    "branchName" TEXT,
    "ifscCode" TEXT,
    "siNachStartDate" TIMESTAMP(3),
    "takeoverCompanyName" TEXT,
    "numberOfTranches" INTEGER,
    "sellerBuilderName" TEXT,
    "sellerBuilderAccountNo" TEXT,
    "sellerBuilderCompanyName" TEXT,
    "sellerBuilderBranchName" TEXT,
    "sellerBuilderIfscCode" TEXT,
    "existingLoanAccountNo" TEXT,
    "existingLoanCompanyName" TEXT,
    "existingLoanSanctionedAmount" INTEGER,
    "existingLoanOutstanding" INTEGER,
    "existingLoanEMI" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldLoanDetails" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "typeOfApplicant" TEXT,
    "loanAmount" DOUBLE PRECISION,
    "tenor" INTEGER,
    "purposeOfLoan" TEXT,
    "chainPieces" INTEGER,
    "banglesPieces" INTEGER,
    "ringsPieces" INTEGER,
    "earringsPieces" INTEGER,
    "othersOrnamentsPieces" INTEGER,
    "totalOrnaments" INTEGER,
    "ornamentValue" DOUBLE PRECISION,
    "insuranceOptIn" TEXT,
    "insuranceScheme" TEXT,
    "premiumAmount" DOUBLE PRECISION,
    "sumAssured" DOUBLE PRECISION,
    "nominee" TEXT,
    "nomineeRelationship" TEXT,
    "referralFee" DOUBLE PRECISION,
    "declarationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoldLoanDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalDetails" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "aadhar" TEXT,
    "voterId" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "spouseName" TEXT,
    "fatherName" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "religion" TEXT,
    "education" TEXT,
    "pan" TEXT,
    "residentialStatus" TEXT,
    "visaNo" TEXT,
    "visaIssueDate" TIMESTAMP(3),
    "currentAddress" TEXT,
    "currentLandmark" TEXT,
    "currentCity" TEXT,
    "currentDistrict" TEXT,
    "currentState" TEXT,
    "currentPincode" TEXT,
    "currentCountry" TEXT,
    "currentResidingInMonths" INTEGER,
    "currentResidentialType" TEXT,
    "sameAsPermanent" TEXT,
    "permanentAddress" TEXT,
    "permanentLandmark" TEXT,
    "permanentCity" TEXT,
    "permanentDistrict" TEXT,
    "permanentState" TEXT,
    "permanentPincode" TEXT,
    "permanentCountry" TEXT,
    "permanentResidingInMonths" INTEGER,
    "permanentResidentialType" TEXT,
    "applicantRole" TEXT,
    "occupationType" TEXT,
    "employerName" TEXT,
    "employerAddress" TEXT,
    "employerPin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "personalDetailsId" TEXT NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "relationship" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountDetails_applicationId_key" ON "AccountDetails"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "GoldLoanDetails_applicationId_key" ON "GoldLoanDetails"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_applicationId_key" ON "PersonalDetails"("applicationId");

-- CreateIndex
CREATE INDEX "Reference_personalDetailsId_idx" ON "Reference"("personalDetailsId");

-- CreateIndex
CREATE INDEX "ActivityLog_applicationId_idx" ON "ActivityLog"("applicationId");

-- CreateIndex
CREATE INDEX "ActivityLog_actionType_idx" ON "ActivityLog"("actionType");

-- CreateIndex
CREATE INDEX "ActivityLog_performedAt_idx" ON "ActivityLog"("performedAt");

-- CreateIndex
CREATE INDEX "Application_customerId_idx" ON "Application"("customerId");

-- CreateIndex
CREATE INDEX "Application_pincode_idx" ON "Application"("pincode");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_loanType_idx" ON "Application"("loanType");

-- AddForeignKey
ALTER TABLE "AccountDetails" ADD CONSTRAINT "AccountDetails_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldLoanDetails" ADD CONSTRAINT "GoldLoanDetails_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalDetails" ADD CONSTRAINT "PersonalDetails_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
