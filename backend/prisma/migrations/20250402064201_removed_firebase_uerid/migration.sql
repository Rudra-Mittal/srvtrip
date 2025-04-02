/*
  Warnings:

  - You are about to drop the column `firebaseUserId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_firebaseUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firebaseUserId";
