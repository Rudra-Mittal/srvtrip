/*
  Warnings:

  - The `startdate` column on the `Itinerary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "startdate",
ADD COLUMN     "startdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
