/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firebaseUserId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firebaseUserId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUserId_key" ON "User"("firebaseUserId");
