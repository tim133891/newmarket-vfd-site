-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StaffRole" ADD VALUE 'ASSISTANT_CHIEF';
ALTER TYPE "StaffRole" ADD VALUE 'CAPTAIN';
ALTER TYPE "StaffRole" ADD VALUE 'LIEUTENANT';

-- AlterTable
ALTER TABLE "RunReport" ADD COLUMN     "age" TEXT,
ADD COLUMN     "chiefComplaint" TEXT,
ADD COLUMN     "cityStateZip" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dateOfIncident" TIMESTAMP(3),
ADD COLUMN     "incidentLocation" TEXT,
ADD COLUMN     "natureOfRun" TEXT,
ADD COLUMN     "patientAddress" TEXT,
ADD COLUMN     "patientName" TEXT,
ADD COLUMN     "patientNumber" TEXT,
ADD COLUMN     "primaryPhysician" TEXT;

-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3);
