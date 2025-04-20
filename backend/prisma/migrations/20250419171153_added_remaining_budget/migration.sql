/*
  Warnings:

  - Added the required column `remainingBudget` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "remainingBudget" DOUBLE PRECISION NOT NULL;
